import ExperienceHero     from '@/components/sections/experience/experience_hero/experience_hero'
import IndustriesSection  from '@/components/sections/experience/industries_section/industries_section'
import TimelineSection    from '@/components/sections/experience/timeline_section/timeline_section'
import SkillsSection      from '@/components/sections/experience/skills_section/skills_section'
import TestimonialsSection from '@/components/sections/experience/testimonials_section/testimonials_section'
import ExperienceCTA      from '@/components/sections/experience/experience_cta/experience_cta'
import { getSiteSettings } from '@/lib/supabase/queries'

export default async function ExperiencePage() {
  const settings = await getSiteSettings()

  return (
    <>
      <ExperienceHero />
      <IndustriesSection />
      <TimelineSection />
      <SkillsSection />
      <TestimonialsSection />
      <ExperienceCTA email={settings?.contact_email || process.env.CONTACT_EMAIL || 'hello@dash.studio'} />
    </>
  )
}
