'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/dashboard/actions/auth'

const nav = [
  { href: '/dashboard',              label: 'Overview',    icon: '⊞' },
  { href: '/dashboard/clients',      label: 'Clients',     icon: '✉' },
  { href: '/dashboard/projects',     label: 'Projects',    icon: '◈' },
  { href: '/dashboard/team',         label: 'Team',        icon: '◎' },
  { href: '/dashboard/testimonials', label: 'Testimonials',icon: '❝' },
  { href: '/dashboard/settings',     label: 'Settings',    icon: '⚙' },
]

export default function SidebarNav({ newClientsCount }: { newClientsCount: number }) {
  const pathname = usePathname()

  return (
    <aside className="dash-sidebar">
      <div className="dash-sidebar__brand">
        <Link href="/dashboard" className="dash-logo">
          DASH
          <span className="dash-logo__dot" />
        </Link>
        <div className="dash-sidebar__meta">
          <span className="dash-sidebar__line" />
          Admin Studio
        </div>
      </div>

      <nav className="dash-nav" aria-label="Dashboard">
        {nav.map(({ href, label, icon }) => {
          const active =
            href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(href)
          const showBadge = href === '/dashboard/clients' && newClientsCount > 0

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={`dash-nav__link${active ? ' is-active' : ''}`}
            >
              <span className="dash-nav__icon">{icon}</span>
              {label}
              {showBadge && (
                <span className="dash-nav__badge">{newClientsCount}</span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="dash-sidebar__foot">
        <form action={logout}>
          <button type="submit" className="dash-logout">
            <span className="dash-nav__icon">↩</span>
            Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}
