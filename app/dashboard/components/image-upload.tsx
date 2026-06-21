'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

const MAX_FILE_SIZE = 6 * 1024 * 1024
const ACCEPTED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
}

interface ImageUploadProps {
  name:        string
  currentUrl?: string | null
  bucket?:     string
  folder?:     string
}

export function ImageUpload({
  name,
  currentUrl,
  bucket = 'media',
  folder = 'uploads',
}: ImageUploadProps) {
  const [preview, setPreview]   = useState<string | null>(currentUrl ?? null)
  const [uploading, setUploading] = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [finalUrl, setFinalUrl] = useState<string>(currentUrl ?? '')
  const inputRef                = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let ignore = false

    async function checkBucket() {
      try {
        const supabase = createClient()
        const { error: bucketError } = await supabase.storage.getBucket(bucket)

        if (!ignore && bucketError?.message.toLowerCase().includes('bucket not found')) {
          setError(`Storage bucket "${bucket}" is missing. Run supabase/storage.sql in the Supabase SQL Editor.`)
        }
      } catch {
        // Upload itself will show a specific error if configuration is still wrong.
      }
    }

    checkBucket()

    return () => {
      ignore = true
    }
  }, [bucket])

  function getStorageErrorMessage(error: unknown) {
    const message = error instanceof Error
      ? error.message
      : typeof error === 'object' && error && 'message' in error
        ? String(error.message)
        : 'Upload failed. Please try again.'
    const lower = message.toLowerCase()

    if (lower.includes('bucket') && lower.includes('not found')) {
      return `Storage bucket "${bucket}" was not found. Create a public bucket named "${bucket}" in Supabase.`
    }

    if (
      lower.includes('row-level security') ||
      lower.includes('policy') ||
      lower.includes('permission') ||
      lower.includes('unauthorized') ||
      lower.includes('403')
    ) {
      return `Storage policy is blocking uploads to "${bucket}". Allow authenticated users to write to this bucket.`
    }

    if (lower.includes('jwt') || lower.includes('session')) {
      return 'Your session expired. Sign out, sign in again, then upload the image.'
    }

    return message
  }

  async function handleFile(file: File) {
    setError(null)

    const ext = ACCEPTED_TYPES[file.type]

    if (!ext) {
      setError('Use a JPG, PNG, WebP, or AVIF image.')
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('Image is too large. Use an image under 6 MB.')
      return
    }

    setUploading(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        setError('You need to be signed in before uploading images.')
        return
      }

      const safeFolder = folder.replace(/^\/+|\/+$/g, '').replace(/[^a-z0-9/_-]/gi, '-')
      const path       = `${safeFolder}/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${ext}`

      const { error: upErr } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '31536000',
          contentType: file.type,
          upsert: false,
        })

      if (upErr) {
        setError(getStorageErrorMessage(upErr))
        return
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(path)
      setPreview(data.publicUrl)
      setFinalUrl(data.publicUrl)
    } catch (uploadError) {
      setError(getStorageErrorMessage(uploadError))
    } finally {
      setUploading(false)
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }
  }

  return (
    <div className="dash-upload">
      {/* Hidden field carries the final URL to the form action */}
      <input type="hidden" name={name} value={finalUrl} />
      <input type="hidden" name={`${name}_uploading`} value={uploading ? 'true' : 'false'} />
      <input type="hidden" name={`${name}_upload_error`} value={error ?? ''} />

      <div
        onClick={() => inputRef.current?.click()}
        className="dash-upload__drop"
      >
        {preview ? (
          <Image
            src={preview}
            alt="Upload preview"
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="dash-upload__empty">
            <span className="dash-upload__icon">↑</span>
            <span>Click to upload image</span>
          </div>
        )}
        {uploading && (
          <div className="dash-upload__overlay">
            <span>Uploading...</span>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />

      {error && <p className="dash-help text-red-600">{error}</p>}

      {preview && (
        <button
          type="button"
          onClick={() => { setPreview(null); setFinalUrl(''); setError(null) }}
          className="dash-danger-link self-start"
        >
          Remove image
        </button>
      )}
    </div>
  )
}
