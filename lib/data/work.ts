export interface WorkProject {
  id:        string
  category:  'branding' | 'web' | 'motion' | 'systems' | 'games'
  year:      string
  featured?: boolean
  colorClass: 'brand' | 'web' | 'motion' | 'systems' | 'games'
}

export const workProjects: WorkProject[] = [
  { id: 'p1',  category: 'branding', year: '2024', featured: true, colorClass: 'brand'   },
  { id: 'p2',  category: 'web',      year: '2024', colorClass: 'web'     },
  { id: 'p3',  category: 'motion',   year: '2024', colorClass: 'motion'  },
  { id: 'p4',  category: 'systems',  year: '2024', colorClass: 'systems' },
  { id: 'p5',  category: 'games',    year: '2024', colorClass: 'games'   },
  { id: 'p6',  category: 'branding', year: '2025', colorClass: 'brand'   },
  { id: 'p7',  category: 'web',      year: '2025', colorClass: 'web'     },
  { id: 'p8',  category: 'motion',   year: '2025', colorClass: 'motion'  },
  { id: 'p9',  category: 'systems',  year: '2025', colorClass: 'systems' },
  { id: 'p10', category: 'games',    year: '2025', colorClass: 'games'   },
  { id: 'p11', category: 'branding', year: '2025', colorClass: 'brand'   },
  { id: 'p12', category: 'web',      year: '2025', colorClass: 'web'     },
]