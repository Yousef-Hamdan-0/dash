'use client'

import { useActionState } from 'react'
import { updateSettings } from '@/app/dashboard/actions/settings'
import { FormField } from '@/app/dashboard/components/form-field'
import { ImageUpload } from '@/app/dashboard/components/image-upload'
import type { DbSiteSettings } from '@/lib/supabase/queries'

export default function SettingsForm({ settings }: { settings: DbSiteSettings | null }) {
  const [state, action, pending] = useActionState(updateSettings, undefined)

  return (
    <div className="dash-page dash-form-page">
      <header className="dash-header">
        <div className="dash-header__main">
          <span className="dash-eyebrow">System</span>
          <h1 className="dash-title">Site settings</h1>
          <p className="dash-copy">Global configuration for DASH Studio.</p>
        </div>
      </header>

      <form action={action} className="dash-form">
        {state?.error && (
          <div className="dash-alert dash-alert--error">
            {state.error}
          </div>
        )}
        {state?.success && (
          <div className="dash-alert dash-alert--success">
            {state.success}
          </div>
        )}

        <div className="dash-form-card">
          <h2 className="dash-form-card__title">Brand</h2>
          <FormField label="Site Name" name="site_name" value={settings?.site_name ?? 'DASH Studio'} required />
          <div>
            <p className="dash-label mb-2">Logo</p>
            <ImageUpload name="logo_url" currentUrl={settings?.logo_url} folder="brand" />
          </div>
        </div>

        <div className="dash-form-card">
          <h2 className="dash-form-card__title">Contact & Email</h2>
          <FormField
            label="Contact Email"
            name="contact_email"
            type="email"
            value={settings?.contact_email ?? ''}
            placeholder="hello@dashstudio.co"
            hint="Where contact form submissions are sent."
          />
          <FormField
            label="From Email"
            name="from_email"
            type="email"
            value={settings?.from_email ?? 'onboarding@resend.dev'}
            placeholder="noreply@yourdomain.com"
            hint="Must be a verified Resend domain in production."
          />
        </div>

        <div className="dash-form-card">
          <h2 className="dash-form-card__title">SEO</h2>
          <FormField label="SEO Title" name="seo_title" value={settings?.seo_title ?? 'DASH Studio'} />
          <FormField
            label="SEO Description"
            name="seo_description"
            value={settings?.seo_description ?? ''}
            rows={2}
            placeholder="Creative studio — Branding, Web, Motion, Systems, Games."
          />
        </div>

        <div className="dash-form-card">
          <h2 className="dash-form-card__title">Social Links</h2>
          <FormField label="Instagram" name="instagram" value={settings?.instagram ?? ''} placeholder="https://instagram.com/dashstudio" />
          <FormField label="Twitter / X" name="twitter"   value={settings?.twitter   ?? ''} placeholder="https://twitter.com/dashstudio" />
          <FormField label="LinkedIn"   name="linkedin"   value={settings?.linkedin   ?? ''} placeholder="https://linkedin.com/company/dashstudio" />
          <FormField label="Behance"    name="behance"    value={settings?.behance    ?? ''} placeholder="https://behance.net/dashstudio" />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="dash-button dash-button--primary self-start"
        >
          {pending ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}
