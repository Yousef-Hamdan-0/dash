import ServicesPageContent from '@/components/sections/services/services_page_content'
import { getSiteSettings } from '@/lib/supabase/queries'
import { normalizeExternalUrl } from '@/lib/safe-url'

export default async function ServicesPage() {
  const settings = await getSiteSettings()
  const contactEmail = settings?.contact_email || process.env.CONTACT_EMAIL || 'hello@dash.studio'

  return (
    <ServicesPageContent
      contact={{
        email: contactEmail,
        phone: settings?.team_phone || process.env.NEXT_PUBLIC_CONTACT_PHONE,
        whatsapp: normalizeExternalUrl(process.env.NEXT_PUBLIC_WHATSAPP_URL),
        instagram: normalizeExternalUrl(settings?.instagram),
        twitter: normalizeExternalUrl(settings?.twitter),
        linkedin: normalizeExternalUrl(settings?.linkedin),
        behance: normalizeExternalUrl(settings?.behance),
      }}
    />
  )
}
