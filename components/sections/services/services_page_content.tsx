'use client'

import ServicesHero from './services_hero_section/services_hero'
import ServiceRow from './service_row_section/service_row'
import ProcessSection from './process_section/process_section'
import ServicesCTA from './services_cta_section/servicess_section'
import { ProjectRequestProvider, type ContactInfo } from './project_request_modal/project_request_modal'
import { services } from '@/lib/data/services'

export default function ServicesPageContent({ contact }: { contact: ContactInfo }) {
  return (
    <ProjectRequestProvider contact={contact}>
      <ServicesHero />
      {services.map((service) => (
        <ServiceRow key={service.id} service={service} />
      ))}
      <ProcessSection />
      <ServicesCTA email={contact.email} />
    </ProjectRequestProvider>
  )
}
