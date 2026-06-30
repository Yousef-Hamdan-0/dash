'use server'

import { requireAdmin } from '@/lib/auth'
import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { PUBLIC_SITE_CACHE_TAG } from '@/lib/cache-tags'

function parseChips(raw: string): string[] {
  return raw
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
}

export async function createJourneyItem(_prev: unknown, formData: FormData) {
  const { supabase, user } = await requireAdmin()
  if (!user) return { error: 'Unauthorized' }

  const year  = Number(formData.get('year'))
  const title = String(formData.get('title') ?? '').trim()

  if (!year || year < 2000 || year > 2100) return { error: 'A valid year is required (2000–2100).' }
  if (!title) return { error: 'Title is required.' }

  const { error } = await supabase.from('journey_items').insert({
    year,
    title,
    description: String(formData.get('description') ?? '').trim() || null,
    chips:       parseChips(String(formData.get('chips') ?? '')),
    sort_order:  Number(formData.get('sort_order') ?? 0),
    is_active:   formData.get('is_active') === 'true',
  })

  if (error) return { error: error.message }

  revalidateTag(PUBLIC_SITE_CACHE_TAG, 'max')
  revalidatePath('/dashboard/journey')
  redirect('/dashboard/journey')
}

export async function updateJourneyItem(id: string, _prev: unknown, formData: FormData) {
  const { supabase, user } = await requireAdmin()
  if (!user) return { error: 'Unauthorized' }

  const year  = Number(formData.get('year'))
  const title = String(formData.get('title') ?? '').trim()

  if (!year || year < 2000 || year > 2100) return { error: 'A valid year is required (2000–2100).' }
  if (!title) return { error: 'Title is required.' }

  const { error } = await supabase.from('journey_items').update({
    year,
    title,
    description: String(formData.get('description') ?? '').trim() || null,
    chips:       parseChips(String(formData.get('chips') ?? '')),
    sort_order:  Number(formData.get('sort_order') ?? 0),
    is_active:   formData.get('is_active') === 'true',
    updated_at:  new Date().toISOString(),
  }).eq('id', id)

  if (error) return { error: error.message }

  revalidateTag(PUBLIC_SITE_CACHE_TAG, 'max')
  revalidatePath('/dashboard/journey')
  redirect('/dashboard/journey')
}

export async function deleteJourneyItem(id: string): Promise<void> {
  const { supabase, user } = await requireAdmin()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase.from('journey_items').delete().eq('id', id)
  if (error) throw new Error(error.message)

  revalidateTag(PUBLIC_SITE_CACHE_TAG, 'max')
  revalidatePath('/dashboard/journey')
  redirect('/dashboard/journey')
}
