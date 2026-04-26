import ServicesHero    from '@/components/sections/services/services_hero_section/services_hero'
import ServiceRow      from '@/components/sections/services/service_row_section/service_row'
import ProcessSection  from '@/components/sections/services/process_section/process_section'
import ServicesCTA     from '@/components/sections/services/servicess_cta_section/servicess_section'
import { services }    from '@/lib/data/services'

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      {services.map((service) => (
        <ServiceRow key={service.id} service={service} />
      ))}
      <ProcessSection />
      <ServicesCTA />
    </>
  )
}