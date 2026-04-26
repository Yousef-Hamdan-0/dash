import { create } from 'zustand'
import { workProjects } from '@/lib/data/work'

type Filter = 'all' | 'branding' | 'web' | 'motion' | 'systems' | 'games'

interface WorkFilterStore {
  active: Filter
  setFilter: (f: Filter) => void
  count: number
  filtered: typeof workProjects
}

export const useWorkFilter = create<WorkFilterStore>((set, get) => ({
  active:   'all',
  filtered: workProjects,
  count:    workProjects.length,

  setFilter: (f: Filter) => {
    const filtered = f === 'all'
      ? workProjects
      : workProjects.filter(p => p.category === f)

    set({ active: f, filtered, count: filtered.length })
  },
}))