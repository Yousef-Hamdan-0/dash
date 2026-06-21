'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { getUploadFieldError } from './upload-fields'
import { PUBLIC_SITE_CACHE_TAG } from '@/lib/cache-tags'

async function generateNextInitials(supabase: Awaited<ReturnType<typeof createClient>>): Promise<string> {
  const { data } = await supabase
    .from('team_members')
    .select('initials')

  const numbers = (data ?? [])
    .map((m: { initials: string }) => {
      const match = m.initials?.match(/^T(\d+)$/)
      return match ? parseInt(match[1], 10) : 0
    })
    .filter((n: number) => n > 0)

  const max = numbers.length > 0 ? Math.max(...numbers) : 0
  return `T${max + 1}`
}

export async function createTeamMember(_prev: unknown, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const uploadError = getUploadFieldError(formData, 'image_url', 'Photo')
  if (uploadError) return { error: uploadError }

  const name = String(formData.get('name') ?? '').trim()
  const role = String(formData.get('role') ?? '').trim()
  const badge = String(formData.get('badge') ?? '').trim()
  if (!name || !role || !badge) return { error: 'English name, role, and badge are required.' }

  const initials = await generateNextInitials(supabase)

  const { error } = await supabase.from('team_members').insert({
    initials,
    name,
    name_ar:    String(formData.get('name_ar') ?? '').trim() || null,
    role,
    role_ar:    String(formData.get('role_ar') ?? '').trim() || null,
    badge,
    image_url:  String(formData.get('image_url') ?? '') || null,
    sort_order: Number(formData.get('sort_order') ?? 0),
    active:     formData.get('active') === 'true',
  })

  if (error) return { error: error.message }

  revalidateTag(PUBLIC_SITE_CACHE_TAG, 'max')
  revalidatePath('/', 'layout')
  return { success: true }
}

export async function updateTeamMember(id: string, _prev: unknown, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const uploadError = getUploadFieldError(formData, 'image_url', 'Photo')
  if (uploadError) return { error: uploadError }

  const name = String(formData.get('name') ?? '').trim()
  const role = String(formData.get('role') ?? '').trim()
  const badge = String(formData.get('badge') ?? '').trim()
  if (!name || !role || !badge) return { error: 'English name, role, and badge are required.' }

  const { error } = await supabase.from('team_members').update({
    initials:   String(formData.get('initials')),
    name,
    name_ar:    String(formData.get('name_ar') ?? '').trim() || null,
    role,
    role_ar:    String(formData.get('role_ar') ?? '').trim() || null,
    badge,
    image_url:  String(formData.get('image_url') ?? '') || null,
    sort_order: Number(formData.get('sort_order') ?? 0),
    active:     formData.get('active') === 'true',
  }).eq('id', id)

  if (error) return { error: error.message }

  revalidateTag(PUBLIC_SITE_CACHE_TAG, 'max')
  revalidatePath('/', 'layout')
  redirect('/dashboard/team')
}

export async function deleteTeamMember(id: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase.from('team_members').delete().eq('id', id)
  if (error) throw new Error(error.message)

  revalidateTag(PUBLIC_SITE_CACHE_TAG, 'max')
  revalidatePath('/', 'layout')
  redirect('/dashboard/team')
}
