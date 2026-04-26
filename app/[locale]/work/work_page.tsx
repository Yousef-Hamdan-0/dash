import WorkHero       from '@/components/sections/work/work_hero/work_hero'
import WorkFilterBar  from '@/components/sections/work/work_filter_bar/work_filter_bar'
import FeaturedProject from '@/components/sections/work/featured_project/featured_project'
import WorkGrid       from '@/components/sections/work/work_grid/work_grid'
import WorkCTA        from '@/components/sections/work/work_cta/work_cta'

export default function WorkPage() {
  return (
    <>
      <WorkHero />
      <WorkFilterBar />
      <FeaturedProject />
      <WorkGrid />
      <WorkCTA />
    </>
  )
}