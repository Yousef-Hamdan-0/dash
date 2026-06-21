import { unstable_cache } from 'next/cache'
import { createClient } from './server'
import { createPublicClient } from './public'
import { isSupabaseConfigured } from './config'
import { team as fallbackTeam } from '@/lib/data/team'
import { workProjects } from '@/lib/data/work'
import { PUBLIC_SITE_CACHE_TAG } from '@/lib/cache-tags'

// ─── Shared Types ────────────────────────────────────────────────────────────

export interface DbProject {
  id:          string
  category:    'branding' | 'web' | 'motion' | 'systems' | 'games'
  year:        string
  featured:    boolean
  color_class: 'brand' | 'web' | 'motion' | 'systems' | 'games'
  title_en:    string
  title_ar:    string | null
  desc_en:     string | null
  desc_ar:     string | null
  image_url:   string | null
  sort_order:  number
  created_at:  string
}

export interface DbTeamMember {
  id:         string
  initials:   string
  name:       string
  role:       string
  badge:      string
  image_url:  string | null
  sort_order: number
  active:     boolean
  created_at: string
}

export interface DbTestimonial {
  id:          string
  quote_en:    string
  quote_ar:    string | null
  author_name: string
  author_role: string
  sort_order:  number
  active:      boolean
  created_at:  string
}

export interface DbSiteSettings {
  id:              string
  site_name:       string
  logo_url:        string | null
  contact_email:   string | null
  from_email:      string | null
  instagram:       string | null
  twitter:         string | null
  linkedin:        string | null
  behance:         string | null
  seo_title:       string | null
  seo_description: string | null
  updated_at:      string
}

export interface DbClient {
  id:         string
  name:       string
  email:      string
  phone:      string | null
  service:    string
  message:    string
  source:     'website' | 'services'
  status:     'new' | 'contacted' | 'qualified' | 'closed'
  created_at: string
  updated_at: string
}

export interface SiteStats {
  projects:     number
  teamMembers:  number
  testimonials: number
  disciplines:  number
}

const fallbackProjectCopy: Record<string, { title: string; desc: string }> = {
  p1:  { title: 'Brand Identity',       desc: 'Full visual identity — logo, guidelines, and brand world.' },
  p2:  { title: 'Web Application',      desc: 'Clean, functional design built for real users and real goals.' },
  p3:  { title: 'Motion Campaign',      desc: 'Storytelling in motion — from concept to final cut.' },
  p4:  { title: 'Clinic System',        desc: 'Custom digital solution that simplified daily clinic operations.' },
  p5:  { title: 'Interactive Game',     desc: 'An immersive experience built with creativity and technical precision.' },
  p6:  { title: 'Startup Identity',     desc: 'From zero to a full brand — helping a startup find its voice.' },
  p7:  { title: 'E-Commerce Platform',  desc: 'A fully custom storefront built for performance and conversion.' },
  p8:  { title: 'Brand Film',           desc: 'A cinematic brand story told in under two minutes.' },
  p9:  { title: 'Operations Dashboard', desc: 'Real-time ops visibility for a growing business.' },
  p10: { title: 'Mobile Game',          desc: '2D mobile experience with tight mechanics and sharp visuals.' },
  p11: { title: 'Brand Refresh',        desc: 'Rethinking and rebuilding a brand that deserved to be seen.' },
  p12: { title: 'Portfolio Website',    desc: "A designer's portfolio — minimal, fast, and memorable." },
}

const fallbackProjects: DbProject[] = workProjects.map((project, index) => {
  const copy = fallbackProjectCopy[project.id]

  return {
    id: project.id,
    category: project.category,
    year: project.year,
    featured: project.featured ?? false,
    color_class: project.colorClass,
    title_en: copy?.title ?? project.id,
    title_ar: null,
    desc_en: copy?.desc ?? null,
    desc_ar: null,
    image_url: null,
    sort_order: index + 1,
    created_at: '',
  }
})

const fallbackTeamMembers: DbTeamMember[] = fallbackTeam.map((member, index) => ({
  id: member.initials.toLowerCase(),
  initials: member.initials,
  name: member.name,
  role: member.role,
  badge: member.badge,
  image_url: member.image ?? null,
  sort_order: index + 1,
  active: true,
  created_at: '',
}))

const fallbackTestimonials: DbTestimonial[] = [
  {
    id: 't1',
    quote_en: "DASH didn't just design our clinic system — they thought through every workflow we had. The result actually changed how we operate day to day.",
    quote_ar: null,
    author_name: 'Ahmad K.',
    author_role: 'Clinic Director',
    sort_order: 1,
    active: true,
    created_at: '',
  },
  {
    id: 't2',
    quote_en: 'We came to them with a vague idea and left with a brand identity that felt exactly like us. Fast, sharp, and professional from day one.',
    quote_ar: null,
    author_name: 'Sara M.',
    author_role: 'Startup Founder',
    sort_order: 2,
    active: true,
    created_at: '',
  },
  {
    id: 't3',
    quote_en: 'The motion content they made for our launch campaign stopped people mid-scroll. We saw engagement go up immediately after the videos dropped.',
    quote_ar: null,
    author_name: 'Rami H.',
    author_role: 'Marketing Lead',
    sort_order: 3,
    active: true,
    created_at: '',
  },
]

async function createOptionalAuthedClient() {
  if (!isSupabaseConfigured()) {
    return null
  }

  return createClient()
}

function createOptionalPublicClient() {
  if (!isSupabaseConfigured()) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'Supabase is not configured for production. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in the deployment environment.'
      )
    }

    return null
  }

  return createPublicClient()
}

// ─── Projects ────────────────────────────────────────────────────────────────

async function fetchProjects(): Promise<DbProject[]> {
  const supabase = createOptionalPublicClient()
  if (!supabase) return fallbackProjects
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) { console.error('getProjects:', error.message); return [] }
  return data ?? []
}

export const getProjects = unstable_cache(
  fetchProjects,
  ['dash-public-projects-v2'],
  { tags: [PUBLIC_SITE_CACHE_TAG], revalidate: 300 }
)

async function fetchFeaturedProject(): Promise<DbProject | null> {
  const supabase = createOptionalPublicClient()
  if (!supabase) return fallbackProjects.find(project => project.featured) ?? null
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('featured', true)
    .limit(1)
    .maybeSingle()
  if (error) { console.error('getFeaturedProject:', error.message); return null }
  return data
}

export const getFeaturedProject = unstable_cache(
  fetchFeaturedProject,
  ['dash-public-featured-project-v2'],
  { tags: [PUBLIC_SITE_CACHE_TAG], revalidate: 300 }
)

export async function getProjectById(id: string): Promise<DbProject | null> {
  const supabase = await createOptionalAuthedClient()
  if (!supabase) return fallbackProjects.find(project => project.id === id) ?? null
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()
  if (error) { console.error('getProjectById:', error.message); return null }
  return data
}

// ─── Team ────────────────────────────────────────────────────────────────────

async function fetchTeamMembers(): Promise<DbTeamMember[]> {
  const supabase = createOptionalPublicClient()
  if (!supabase) return fallbackTeamMembers
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true })
  if (error) { console.error('getTeamMembers:', error.message); return [] }
  return data ?? []
}

export const getTeamMembers = unstable_cache(
  fetchTeamMembers,
  ['dash-public-team-members-v2'],
  { tags: [PUBLIC_SITE_CACHE_TAG], revalidate: 300 }
)

export async function getTeamMemberById(id: string): Promise<DbTeamMember | null> {
  const supabase = await createOptionalAuthedClient()
  if (!supabase) return fallbackTeamMembers.find(member => member.id === id) ?? null
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('id', id)
    .single()
  if (error) { console.error('getTeamMemberById:', error.message); return null }
  return data
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

async function fetchTestimonials(): Promise<DbTestimonial[]> {
  const supabase = createOptionalPublicClient()
  if (!supabase) return fallbackTestimonials
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true })
  if (error) { console.error('getTestimonials:', error.message); return [] }
  return data ?? []
}

export const getTestimonials = unstable_cache(
  fetchTestimonials,
  ['dash-public-testimonials-v2'],
  { tags: [PUBLIC_SITE_CACHE_TAG], revalidate: 300 }
)

export async function getTestimonialById(id: string): Promise<DbTestimonial | null> {
  const supabase = await createOptionalAuthedClient()
  if (!supabase) return fallbackTestimonials.find(testimonial => testimonial.id === id) ?? null
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('id', id)
    .single()
  if (error) { console.error('getTestimonialById:', error.message); return null }
  return data
}

// ─── Settings ─────────────────────────────────────────────────────────────────

async function fetchSiteSettings(): Promise<DbSiteSettings | null> {
  const supabase = createOptionalPublicClient()
  if (!supabase) return null
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .limit(1)
    .single()
  if (error) { console.error('getSiteSettings:', error.message); return null }
  return data
}

export const getSiteSettings = unstable_cache(
  fetchSiteSettings,
  ['dash-public-site-settings-v2'],
  { tags: [PUBLIC_SITE_CACHE_TAG], revalidate: 300 }
)

// ─── Admin: all records (including inactive) ─────────────────────────────────

export async function getAllProjects(): Promise<DbProject[]> {
  const supabase = await createOptionalAuthedClient()
  if (!supabase) return fallbackProjects
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) { console.error('getAllProjects:', error.message); return [] }
  return data ?? []
}

export async function getAllTeamMembers(): Promise<DbTeamMember[]> {
  const supabase = await createOptionalAuthedClient()
  if (!supabase) return fallbackTeamMembers
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) { console.error('getAllTeamMembers:', error.message); return [] }
  return data ?? []
}

export async function getAllTestimonials(): Promise<DbTestimonial[]> {
  const supabase = await createOptionalAuthedClient()
  if (!supabase) return fallbackTestimonials
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) { console.error('getAllTestimonials:', error.message); return [] }
  return data ?? []
}

// ─── Clients ─────────────────────────────────────────────────────────────────

export async function getAllClients(): Promise<DbClient[]> {
  const supabase = await createOptionalAuthedClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) { console.error('getAllClients:', error.message); return [] }
  return data ?? []
}

export async function getClientById(id: string): Promise<DbClient | null> {
  const supabase = await createOptionalAuthedClient()
  if (!supabase) return null
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single()
  if (error) { console.error('getClientById:', error.message); return null }
  return data
}

export async function getNewClientsCount(): Promise<number> {
  const supabase = await createOptionalAuthedClient()
  if (!supabase) return 0
  const { count, error } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'new')
  if (error) { console.error('getNewClientsCount:', error.message); return 0 }
  return count ?? 0
}

// ─── Site Stats ───────────────────────────────────────────────────────────────

export async function getSiteStats(): Promise<SiteStats> {
  const [projects, teamMembers, testimonials] = await Promise.all([
    getProjects(),
    getTeamMembers(),
    getTestimonials(),
  ])

  return {
    projects: projects.length,
    teamMembers: teamMembers.length,
    testimonials: testimonials.length,
    disciplines: new Set(projects.map((project) => project.category)).size,
  }
}
