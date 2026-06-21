import { redirect } from 'next/navigation'
import Link from 'next/link'
import Sidebar from '@/app/dashboard/components/sidebar'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { createClient } from '@/lib/supabase/server'
import DashLogo from '@/app/dashboard/components/dash-logo'

export default async function DashboardAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="dash-login">
        <div className="dash-login__card">
          <div className="dash-login__head">
            <DashLogo />
          </div>
          <div className="dash-login__form">
            <h1 className="dash-section-title">Supabase is not configured</h1>
            <p className="dash-copy">
              Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local to use the dashboard.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/dashboard/login')

  return (
    <div className="dash-shell">
      <Sidebar />
      <div className="dash-main">
        <header className="dash-topbar">
          <div className="dash-topbar__title">
            <span className="dash-topbar__pulse" />
            Studio Control
          </div>
          <Link href="/en" className="dash-button dash-button--secondary">
            View site
            <span aria-hidden="true">↗</span>
          </Link>
        </header>
        <main className="dash-content">{children}</main>
      </div>
    </div>
  )
}
