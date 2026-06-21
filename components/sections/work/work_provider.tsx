'use client'

import { useLayoutEffect } from 'react'
import { useWorkFilter } from '@/lib/store/work_filter'
import type { DbProject } from '@/lib/supabase/queries'

export function WorkProvider({
  projects,
  children,
}: {
  projects: DbProject[]
  children: React.ReactNode
}) {
  const setProjects = useWorkFilter((s) => s.setProjects)

  useLayoutEffect(() => {
    setProjects(projects)
  }, [projects, setProjects])

  return <>{children}</>
}
