'use client'

import { useActionState } from 'react'
import { login } from '@/app/dashboard/actions/auth'

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined)

  return (
    <div className="dash-login">
      <div className="dash-login__card">
        <div className="dash-login__head">
          <span className="dash-logo">
            DASH
            <span className="dash-logo__dot" />
          </span>
          <p className="dash-copy">Admin Dashboard</p>
        </div>

        <form action={action} className="dash-login__form">
          <h1 className="dash-section-title">Sign in</h1>

          {state?.error && (
            <div className="dash-alert dash-alert--error">
              {state.error}
            </div>
          )}

          <div className="dash-field">
            <label htmlFor="email" className="dash-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="admin@yourdomain.com"
              className="dash-input"
            />
          </div>

          <div className="dash-field">
            <label htmlFor="password" className="dash-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="Password"
              className="dash-input"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="dash-button dash-button--primary w-full"
          >
            {pending ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
