'use server'

import { requireAdmin } from '@/lib/auth'
import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { PUBLIC_SITE_CACHE_TAG } from '@/lib/cache-tags'

export async function createTestimonial(_prev: unknown, formData: FormData) {
  const { supabase, user } = await requireAdmin()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase.from('testimonials').insert({
    quote_en:    String(formData.get('quote_en')),
    quote_ar:    String(formData.get('quote_ar') ?? '') || null,
    author_name: String(formData.get('author_name')),
    author_role: String(formData.get('author_role')),
    sort_order:  Number(formData.get('sort_order') ?? 0),
    active:      formData.get('active') === 'true',
  })

  if (error) return { error: error.message }

  revalidateTag(PUBLIC_SITE_CACHE_TAG, 'max')
  revalidatePath('/', 'layout')
  redirect('/dashboard/testimonials')
}

export async function updateTestimonial(id: string, _prev: unknown, formData: FormData) {
  const { supabase, user } = await requireAdmin()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase.from('testimonials').update({
    quote_en:    String(formData.get('quote_en')),
    quote_ar:    String(formData.get('quote_ar') ?? '') || null,
    author_name: String(formData.get('author_name')),
    author_role: String(formData.get('author_role')),
    sort_order:  Number(formData.get('sort_order') ?? 0),
    active:      formData.get('active') === 'true',
  }).eq('id', id)

  if (error) return { error: error.message }

  revalidateTag(PUBLIC_SITE_CACHE_TAG, 'max')
  revalidatePath('/', 'layout')
  redirect('/dashboard/testimonials')
}

export async function deleteTestimonial(id: string): Promise<void> {
  const { supabase, user } = await requireAdmin()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase.from('testimonials').delete().eq('id', id)
  if (error) throw new Error(error.message)

  revalidateTag(PUBLIC_SITE_CACHE_TAG, 'max')
  revalidatePath('/', 'layout')
  redirect('/dashboard/testimonials')
}
