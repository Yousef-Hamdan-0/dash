'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { createJourneyItem } from '@/app/dashboard/actions/journey'
import { FormField, CheckboxField } from '@/app/dashboard/components/form-field'

export default function NewJourneyItemPage() {
  const [state, action, pending] = useActionState(createJourneyItem, undefined)

  return (
    <div className="dash-page dash-form-page">
      <div className="dash-breadcrumb">
        <Link href="/dashboard/journey">Journey</Link>
        <span>/</span>
        <span>New Milestone</span>
      </div>

      <header className="dash-header">
        <div className="dash-header__main">
          <span className="dash-eyebrow">Experience</span>
          <h1 className="dash-title">Add Journey Milestone</h1>
        </div>
      </header>

      <form action={action} className="dash-form">
        {state?.error && (
          <div className="dash-alert dash-alert--error">{state.error}</div>
        )}

        <div className="dash-form-card">
          <h2 className="dash-form-card__title">Details</h2>
          <div className="dash-form-grid">
            <FormField
              label="Year"
              name="year"
              type="number"
              required
              placeholder="2026"
              value={String(new Date().getFullYear())}
              hint="The year this milestone occurred."
            />
            <FormField label="Sort Order" name="sort_order" type="number" value="0" />
          </div>
          <FormField label="Title" name="title" required placeholder="DASH Studio Founded" />
          <FormField
            label="Description"
            name="description"
            rows={3}
            placeholder="A short description of this milestone…"
          />
          <FormField
            label="Tags (comma-separated)"
            name="chips"
            placeholder="Studio, Launch, Team"
            hint="Shown as small chips next to the milestone."
          />
          <CheckboxField
            label="Visible on website"
            name="is_active"
            checked
            hint="Uncheck to hide this milestone from the public timeline."
          />
        </div>

        <div className="dash-actions">
          <button type="submit" disabled={pending} className="dash-button dash-button--primary">
            {pending ? 'Saving…' : 'Add Milestone'}
          </button>
          <Link href="/dashboard/journey" className="dash-button dash-button--secondary">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
