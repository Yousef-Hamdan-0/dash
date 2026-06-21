import { isSupabaseConfigured } from '@/lib/supabase/config'
import LoginForm from './login-form'

export default function LoginPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="dash-login">
        <div className="dash-login__card">
          <div className="dash-login__head">
            <span className="dash-logo">
              DASH
              <span className="dash-logo__dot" />
            </span>
          </div>
          <div className="dash-login__form">
            <h1 className="dash-section-title">Supabase is not configured</h1>
            <p className="dash-copy">
              Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then restart npm run dev.
            </p>
            <pre className="dash-alert dash-alert--error overflow-x-auto font-mono text-xs">{`NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-or-anon-key`}</pre>
          </div>
        </div>
      </div>
    )
  }

  return <LoginForm />
}
