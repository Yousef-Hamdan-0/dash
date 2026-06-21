'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { getUploadFieldError } from './upload-fields'
import { PUBLIC_SITE_CACHE_TAG } from '@/lib/cache-tags'

export async function createTeamMember(_prev: unknown, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const uploadError = getUploadFieldError(formData, 'image_url', 'Photo')
  if (uploadError) return { error: uploadError }

  const { error } = await supabase.from('team_members').insert({
    initials:   String(formData.get('initials')),
    name:       String(formData.get('name')),
    role:       String(formData.get('role')),
    badge:      String(formData.get('badge')),
    image_url:  String(formData.get('image_url') ?? '') || null,
    sort_order: Number(formData.get('sort_order') ?? 0),
    active:     formData.get('active') === 'true',
  })

  if (error) return { error: error.message }

  revalidateTag(PUBLIC_SITE_CACHE_TAG, 'max')
  revalidatePath('/', 'layout')
  redirect('/dashboard/team')
}

export async function updateTeamMember(id: string, _prev: unknown, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const uploadError = getUploadFieldError(formData, 'image_url', 'Photo')
  if (uploadError) return { error: uploadError }

  const { error } = await supabase.from('team_members').update({
    initials:   String(formData.get('initials')),
    name:       String(formData.get('name')),
    role:       String(formData.get('role')),
    badge:      String(formData.get('badge')),
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
