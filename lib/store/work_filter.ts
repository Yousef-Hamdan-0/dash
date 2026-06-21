import { create } from 'zustand'
import type { DbProject } from '@/lib/supabase/queries'

export type Filter = 'all' | 'branding' | 'web' | 'motion' | 'systems' | 'games'

interface WorkFilterStore {
  projects:    DbProject[]
  active:      Filter
  filtered:    DbProject[]
  count:       number
  setProjects: (projects: DbProject[]) => void
  setFilter:   (f: Filter) => void
}

export const useWorkFilter = create<WorkFilterStore>((set, get) => ({
  projects: [],
  active:   'all',
  filtered: [],
  count:    0,

  setProjects: (projects: DbProject[]) => {
    const { active } = get()
    const filtered = active === 'all'
      ? projects
      : projects.filter(p => p.category === active)
    set({ projects, filtered, count: filtered.length })
  },

  setFilter: (f: Filter) => {
    const { projects } = get()
    const filtered = f === 'all'
      ? projects
      : projects.filter(p => p.category === f)
    set({ active: f, filtered, count: filtered.length })
  },
}))
