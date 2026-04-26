import { ServiceItem } from '@/types'

export const services: ServiceItem[] = [
  {
    id:       '01',
    slug:     'branding',
    theme:    'light',
    reverse:  false,
    vcStyle:  'light',
    visTags:  ['Logo', 'Colors', 'Typography', 'Guidelines'],
    features: ['', '', '', '', '', ''],
  },
  {
    id:       '02',
    slug:     'web',
    theme:    'alt',
    reverse:  true,
    vcStyle:  'light',
    visTags:  ['UI/UX', 'Frontend', 'Backend', 'CMS'],
    features: ['', '', '', '', '', ''],
  },
  {
    id:       '03',
    slug:     'motion',
    theme:    'dark',
    reverse:  false,
    vcStyle:  'blue',
    visTags:  ['Films', 'Reels', 'Animation', 'Motion'],
    features: ['', '', '', '', '', ''],
  },
  {
    id:       '04',
    slug:     'systems',
    theme:    'alt',
    reverse:  true,
    vcStyle:  'light',
    visTags:  ['Dashboard', 'CRM', 'Analytics', 'API'],
    features: ['', '', '', '', '', ''],
  },
  {
    id:       '05',
    slug:     'games',
    theme:    'light',
    reverse:  false,
    vcStyle:  'dark',
    visTags:  ['Unity', 'Unreal', '2D/3D', 'Interactive'],
    features: ['', '', '', '', '', ''],
  },
]