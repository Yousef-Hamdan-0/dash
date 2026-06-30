'use server'

import { requireAdmin } from '@/lib/auth'
import { revalidatePath, revalidateTag } from 'next/cache'
import { getUploadFieldError } from './upload-fields'
import { PUBLIC_SITE_CACHE_TAG } from '@/lib/cache-tags'
import { normalizeExternalUrl } from '@/lib/safe-url'
import { isValidEmail } from '@/lib/validation'

export async function updateSettings(_prev: unknown, formData: FormData) {
  const { supabase, user } = await requireAdmin()
  if (!user) return { error: 'Unauthorized' }

  const uploadError = getUploadFieldError(formData, 'logo_url', 'Logo')
  if (uploadError) return { error: uploadError }

  const contactEmail = String(formData.get('contact_email') ?? '').trim()
  const fromEmail = String(formData.get('from_email') ?? '').trim()
  if (contactEmail && !isValidEmail(contactEmail)) return { error: 'Contact email is invalid.' }
  if (fromEmail && !isValidEmail(fromEmail)) return { error: 'From email is invalid.' }

  const socialFields = ['instagram', 'twitter', 'linkedin', 'behance'] as const
  const socialLinks: Record<(typeof socialFields)[number], string | null> = {
    instagram: null,
    twitter: null,
    linkedin: null,
    behance: null,
  }

  for (const field of socialFields) {
    const raw = String(formData.get(field) ?? '').trim()
    const normalized = normalizeExternalUrl(raw)
    if (raw && !normalized) return { error: `${field} must be a complete http(s) URL.` }
    socialLinks[field] = normalized
  }

  const values = {
    site_name:       String(formData.get('site_name') ?? 'DASH Studio'),
    contact_email:   contactEmail || null,
    from_email:      fromEmail || null,
    team_phone:      String(formData.get('team_phone') ?? '').trim() || null,
    ...socialLinks,
    seo_title:       String(formData.get('seo_title') ?? ''),
    seo_description: String(formData.get('seo_description') ?? ''),
    logo_url:        String(formData.get('logo_url') ?? '') || null,
    updated_at:      new Date().toISOString(),
  }

  const { data: existing, error: lookupError } = await supabase
    .from('site_settings')
    .select('id')
    .limit(1)
    .maybeSingle()

  if (lookupError) return { error: lookupError.message }

  const { error } = existing
    ? await supabase.from('site_settings').update(values).eq('id', existing.id)
    : await supabase.from('site_settings').insert(values)

  if (error) return { error: error.message }

  revalidateTag(PUBLIC_SITE_CACHE_TAG, 'max')
  revalidatePath('/', 'layout')
  return { success: 'Settings saved.' }
}
