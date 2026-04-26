import Hero from '@/components/sections/home/hero_section/hero'
import NumbersStrip from '@/components/sections/home/numbers_strip_secton/numbers_strip'
import ServicesListSection from '@/components/sections/home/services_list_section/services_list_section'
import WorkGrid from '@/components/sections/home/work_gride_section/work_grid'
import Team from '@/components/sections/home/team_section/team_section'
import Experience from '@/components/sections/home/experience_section/experience_section'
import Contact from '@/components/sections/home/contact_section/contact_section'
export default function Home() {
  return (
    <main>
      <Hero />
      <NumbersStrip />
      <ServicesListSection />
      <WorkGrid />
      <Experience />
      <Team />
      <Contact />
    </main>
  )
}
