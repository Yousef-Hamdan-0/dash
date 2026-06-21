'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { getUploadFieldError } from './upload-fields'
import { PUBLIC_SITE_CACHE_TAG } from '@/lib/cache-tags'
import { normalizeLinkHref } from '@/lib/safe-url'

function getButtonUrl(formData: FormData) {
  const raw = String(formData.get('button_url') ?? '').trim()
  return { raw, normalized: normalizeLinkHref(raw) }
}

export async function createAnnouncement(_prev: unknown, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const uploadError = getUploadFieldError(formData, 'image_url', 'Image')
  if (uploadError) return { error: uploadError }

  const title = String(formData.get('title') ?? '').trim()
  if (!title) return { error: 'Title is required.' }
  const buttonUrl = getButtonUrl(formData)
  if (buttonUrl.raw && !buttonUrl.normalized) {
    return { error: 'Button URL must be an internal path or a complete http(s) URL.' }
  }

  const { error } = await supabase.from('home_announcements').insert({
    title,
    description: String(formData.get('description') ?? '').trim() || null,
    image_url:   String(formData.get('image_url') ?? '') || null,
    button_text: String(formData.get('button_text') ?? '').trim() || null,
    button_url:  buttonUrl.normalized,
    sort_order:  Number(formData.get('sort_order') ?? 0),
    is_active:   formData.get('is_active') === 'true',
  })

  if (error) return { error: error.message }

  revalidateTag(PUBLIC_SITE_CACHE_TAG, 'max')
  revalidatePath('/dashboard/announcements')
  redirect('/dashboard/announcements')
}

export async function updateAnnouncement(id: string, _prev: unknown, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const uploadError = getUploadFieldError(formData, 'image_url', 'Image')
  if (uploadError) return { error: uploadError }

  const title = String(formData.get('title') ?? '').trim()
  if (!title) return { error: 'Title is required.' }
  const buttonUrl = getButtonUrl(formData)
  if (buttonUrl.raw && !buttonUrl.normalized) {
    return { error: 'Button URL must be an internal path or a complete http(s) URL.' }
  }

  const { error } = await supabase.from('home_announcements').update({
    title,
    description: String(formData.get('description') ?? '').trim() || null,
    image_url:   String(formData.get('image_url') ?? '') || null,
    button_text: String(formData.get('button_text') ?? '').trim() || null,
    button_url:  buttonUrl.normalized,
    sort_order:  Number(formData.get('sort_order') ?? 0),
    is_active:   formData.get('is_active') === 'true',
    updated_at:  new Date().toISOString(),
  }).eq('id', id)

  if (error) return { error: error.message }

  revalidateTag(PUBLIC_SITE_CACHE_TAG, 'max')
  revalidatePath('/dashboard/announcements')
  redirect('/dashboard/announcements')
}

export async function deleteAnnouncement(id: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase.from('home_announcements').delete().eq('id', id)
  if (error) throw new Error(error.message)

  revalidateTag(PUBLIC_SITE_CACHE_TAG, 'max')
  revalidatePath('/dashboard/announcements')
  redirect('/dashboard/announcements')
}
