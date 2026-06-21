import ServicesHero    from '@/components/sections/services/services_hero_section/services_hero'
import ServiceRow      from '@/components/sections/services/service_row_section/service_row'
import ProcessSection  from '@/components/sections/services/process_section/process_section'
import ServicesCTA from '@/components/sections/services/services_cta_section/servicess_section'
import { ProjectRequestProvider } from '@/components/sections/services/project_request_modal/project_request_modal'
import { services }    from '@/lib/data/services'
import { getSiteSettings } from '@/lib/supabase/queries'

export default async function ServicesPage() {
  const settings = await getSiteSettings()
  const contactEmail = settings?.contact_email || process.env.CONTACT_EMAIL || 'hello@dash.studio'

  return (
    <ProjectRequestProvider
      contact={{
        email: contactEmail,
        phone: process.env.NEXT_PUBLIC_CONTACT_PHONE,
        whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_URL,
        instagram: settings?.instagram,
        twitter: settings?.twitter,
        linkedin: settings?.linkedin,
        behance: settings?.behance,
      }}
    >
      <ServicesHero />
      {services.map((service) => (
        <ServiceRow key={service.id} service={service} />
      ))}
      <ProcessSection />
      <ServicesCTA />
    </ProjectRequestProvider>
  )
}
