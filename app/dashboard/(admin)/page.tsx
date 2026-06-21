import Link from 'next/link'
import { getAllProjects, getAllTeamMembers, getAllTestimonials, getAllClients } from '@/lib/supabase/queries'
import AddClientModal from './clients/add-client-modal'

export default async function DashboardPage() {
  const [projects, team, testimonials, clients] = await Promise.all([
    getAllProjects(),
    getAllTeamMembers(),
    getAllTestimonials(),
    getAllClients(),
  ])

  const newClients = clients.filter((c) => c.status === 'new').length

  const stats = [
    { label: 'Projects', value: projects.length, href: '/dashboard/projects', icon: '◈', note: 'Portfolio entries' },
    { label: 'Team', value: team.filter((m) => m.active).length, href: '/dashboard/team', icon: '◎', note: `${team.length} total members` },
    { label: 'Testimonials', value: testimonials.filter((t) => t.active).length, href: '/dashboard/testimonials', icon: '❝', note: `${testimonials.length} total quotes` },
    { label: 'Inquiries', value: clients.length, href: '/dashboard/clients', icon: '✉', note: newClients > 0 ? `${newClients} new` : 'All reviewed', highlight: newClients > 0 },
  ]

  const quickLinks = [
    { href: '/dashboard/clients',          label: 'View Inquiries' },
    { href: '/dashboard/projects/new',     label: 'New Project' },
    { href: '/dashboard/team/new',         label: 'Add Team Member' },
    { href: '/dashboard/testimonials/new', label: 'Add Testimonial' },
    { href: '/dashboard/settings',         label: 'Site Settings' },
  ]

  return (
    <div className="dash-page">
      <header className="dash-header">
        <div className="dash-header__main">
          <span className="dash-eyebrow">Dashboard</span>
          <h1 className="dash-title">Studio overview</h1>
          <p className="dash-copy">Manage the content that powers the DASH Studio website.</p>
        </div>
        <AddClientModal />
      </header>

      <section className="dash-stat-grid">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`dash-stat-card${s.highlight ? ' dash-stat-card--alert' : ''}`}
          >
            <div>
              <div className="dash-stat-card__top">
                <span className="dash-stat-label">{s.label}</span>
                <span className="dash-stat-icon">{s.icon}</span>
              </div>
              <div className="dash-stat-value">{s.value}</div>
            </div>
            <p className={`dash-stat-note${s.highlight ? ' dash-stat-note--alert' : ''}`}>{s.note}</p>
          </Link>
        ))}
      </section>

      <section className="dash-grid-2">
        <div className="dash-panel">
          <div className="dash-panel__head">
            <div>
              <span className="dash-section-label">Work</span>
              <h2 className="dash-section-title">Recent projects</h2>
            </div>
            <Link href="/dashboard/projects" className="dash-link">
              View all
            </Link>
          </div>
          <div className="dash-table-wrap">
            <table className="dash-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Year</th>
                <th>State</th>
              </tr>
            </thead>
            <tbody>
              {projects.slice(0, 6).map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link href={`/dashboard/projects/${p.id}`} className="hover:underline">
                      {p.title_en}
                    </Link>
                  </td>
                  <td className="capitalize">{p.category}</td>
                  <td>{p.year}</td>
                  <td>
                    {p.featured && (
                      <span className="dash-chip dash-chip--amber">
                        Featured
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        </div>

        <div className="dash-panel">
          <div className="dash-panel__head">
            <div>
              <span className="dash-section-label">Create</span>
              <h2 className="dash-section-title">Quick actions</h2>
            </div>
          </div>
          <div className="dash-panel__body">
            <div className="dash-quick-list">
              {quickLinks.map((l) => (
                <Link key={l.href} href={l.href} className="dash-quick-link">
                  {l.label}
                  <span aria-hidden="true">+</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
