export interface ServiceItem {
  id:       string
  slug:     string
  theme:    'light' | 'alt' | 'dark'
  reverse:  boolean
  vcStyle:  'light' | 'blue' | 'dark'
  visTags:  string[]
  features: string[]
  image:    string
}

export interface TeamMember {
  initials: string
  name:     string
  role:     string
  badge:    string
  image?:   string   // ← optional
}
