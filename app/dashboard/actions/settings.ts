'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { getUploadFieldError } from './upload-fields'
import { PUBLIC_SITE_CACHE_TAG } from '@/lib/cache-tags'

export async function updateSettings(_prev: unknown, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const uploadError = getUploadFieldError(formData, 'logo_url', 'Logo')
  if (uploadError) return { error: uploadError }

  // Upsert: update the single settings row (or insert if missing)
  const { error } = await supabase.from('site_settings').upsert({
    site_name:       String(formData.get('site_name') ?? 'DASH Studio'),
    contact_email:   String(formData.get('contact_email') ?? ''),
    from_email:      String(formData.get('from_email') ?? ''),
    instagram:       String(formData.get('instagram') ?? '') || null,
    twitter:         String(formData.get('twitter') ?? '') || null,
    linkedin:        String(formData.get('linkedin') ?? '') || null,
    behance:         String(formData.get('behance') ?? '') || null,
    seo_title:       String(formData.get('seo_title') ?? ''),
    seo_description: String(formData.get('seo_description') ?? ''),
    logo_url:        String(formData.get('logo_url') ?? '') || null,
    updated_at:      new Date().toISOString(),
  })

  if (error) return { error: error.message }

  revalidateTag(PUBLIC_SITE_CACHE_TAG, 'max')
  revalidatePath('/', 'layout')
  return { success: 'Settings saved.' }
}
