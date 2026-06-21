'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { updateJourneyItem } from '@/app/dashboard/actions/journey'
import { FormField, CheckboxField } from '@/app/dashboard/components/form-field'
import type { DbJourneyItem } from '@/lib/supabase/queries'

export default function EditJourneyItemForm({ item }: { item: DbJourneyItem }) {
  const boundAction = updateJourneyItem.bind(null, item.id)
  const [state, action, pending] = useActionState(boundAction, undefined)

  return (
    <div className="dash-page dash-form-page">
      <div className="dash-breadcrumb">
        <Link href="/dashboard/journey">Journey</Link>
        <span>/</span>
        <span>{item.title}</span>
      </div>

      <header className="dash-header">
        <div className="dash-header__main">
          <span className="dash-eyebrow">Experience</span>
          <h1 className="dash-title">Edit Milestone</h1>
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
              value={String(item.year)}
              hint="The year this milestone occurred."
            />
            <FormField label="Sort Order" name="sort_order" type="number" value={String(item.sort_order)} />
          </div>
          <FormField label="Title" name="title" required value={item.title} />
          <FormField
            label="Description"
            name="description"
            rows={3}
            value={item.description ?? ''}
          />
          <FormField
            label="Tags (comma-separated)"
            name="chips"
            value={item.chips.join(', ')}
            hint="Shown as small chips next to the milestone."
          />
          <CheckboxField
            label="Visible on website"
            name="is_active"
            checked={item.is_active}
            hint="Uncheck to hide this milestone from the public timeline."
          />
        </div>

        <div className="dash-actions">
          <button type="submit" disabled={pending} className="dash-button dash-button--primary">
            {pending ? 'Saving…' : 'Save Changes'}
          </button>
          <Link href="/dashboard/journey" className="dash-button dash-button--secondary">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
