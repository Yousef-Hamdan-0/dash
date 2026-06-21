'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { getUploadFieldError } from './upload-fields'
import { getNextProjectId } from '@/lib/project-id'
import { PUBLIC_SITE_CACHE_TAG } from '@/lib/cache-tags'

export async function createProject(_prev: unknown, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const uploadError = getUploadFieldError(formData, 'image_url', 'Cover image')
  if (uploadError) return { error: uploadError }

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const { data: existingProjects, error: idError } = await supabase
      .from('projects')
      .select('id')

    if (idError) return { error: idError.message }

    const id = getNextProjectId(existingProjects ?? [])
    const { error } = await supabase.from('projects').insert({
      id,
      category:    String(formData.get('category')),
      year:        String(formData.get('year')),
      featured:    formData.get('featured') === 'true',
      color_class: String(formData.get('color_class')),
      title_en:    String(formData.get('title_en')),
      title_ar:    String(formData.get('title_ar') ?? ''),
      desc_en:     String(formData.get('desc_en') ?? ''),
      desc_ar:     String(formData.get('desc_ar') ?? ''),
      image_url:   String(formData.get('image_url') ?? '') || null,
      sort_order:  Number(formData.get('sort_order') ?? 0),
    })

    if (!error) {
      revalidateTag(PUBLIC_SITE_CACHE_TAG, 'max')
      revalidatePath('/', 'layout')
      redirect('/dashboard/projects')
    }

    if (error.code !== '23505') return { error: error.message }
  }

  return { error: 'Could not generate a unique project ID. Please try again.' }
}

export async function updateProject(id: string, _prev: unknown, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const uploadError = getUploadFieldError(formData, 'image_url', 'Cover image')
  if (uploadError) return { error: uploadError }

  const { error } = await supabase.from('projects').update({
    category:    String(formData.get('category')),
    year:        String(formData.get('year')),
    featured:    formData.get('featured') === 'true',
    color_class: String(formData.get('color_class')),
    title_en:    String(formData.get('title_en')),
    title_ar:    String(formData.get('title_ar') ?? ''),
    desc_en:     String(formData.get('desc_en') ?? ''),
    desc_ar:     String(formData.get('desc_ar') ?? ''),
    image_url:   String(formData.get('image_url') ?? '') || null,
    sort_order:  Number(formData.get('sort_order') ?? 0),
  }).eq('id', id)

  if (error) return { error: error.message }

  revalidateTag(PUBLIC_SITE_CACHE_TAG, 'max')
  revalidatePath('/', 'layout')
  redirect('/dashboard/projects')
}

export async function deleteProject(id: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw new Error(error.message)

  revalidateTag(PUBLIC_SITE_CACHE_TAG, 'max')
  revalidatePath('/', 'layout')
  redirect('/dashboard/projects')
}
