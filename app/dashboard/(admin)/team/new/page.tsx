'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { createTeamMember } from '@/app/dashboard/actions/team'
import { FormField, CheckboxField } from '@/app/dashboard/components/form-field'
import { ImageUpload } from '@/app/dashboard/components/image-upload'

export default function NewTeamMemberPage() {
  const [state, action, pending] = useActionState(createTeamMember, undefined)

  return (
    <div className="dash-page dash-form-page">
      <div className="dash-breadcrumb">
        <Link href="/dashboard/team">Team</Link>
        <span>/</span>
        <span>New Member</span>
      </div>

      <header className="dash-header">
        <div className="dash-header__main">
          <span className="dash-eyebrow">People</span>
          <h1 className="dash-title">Add team member</h1>
        </div>
      </header>

      <form action={action} className="dash-form">
        {state?.error && (
          <div className="dash-alert dash-alert--error">
            {state.error}
          </div>
        )}

        <div className="dash-form-card">
          <h2 className="dash-form-card__title">Details</h2>
          <div className="dash-form-grid">
            <FormField label="Full Name" name="name" required placeholder="Yousef Hamdan" />
            <FormField label="Initials" name="initials" required placeholder="YH" hint="Shown as avatar fallback." />
          </div>
          <div className="dash-form-grid">
            <FormField label="Role" name="role" required placeholder="Full-Stack Dev" />
            <FormField label="Badge" name="badge" required placeholder="Dev" hint="Short label shown on card." />
          </div>
          <div className="dash-form-grid">
            <FormField label="Sort Order" name="sort_order" type="number" value="0" />
          </div>
          <CheckboxField label="Active (shown on site)" name="active" checked hint="Uncheck to hide from the website without deleting." />
        </div>

        <div className="dash-form-card">
          <h2 className="dash-form-card__title">Photo</h2>
          <ImageUpload name="image_url" folder="team" />
        </div>

        <div className="dash-actions">
          <button
            type="submit"
            disabled={pending}
            className="dash-button dash-button--primary"
          >
            {pending ? 'Adding...' : 'Add Member'}
          </button>
          <Link
            href="/dashboard/team"
            className="dash-button dash-button--secondary"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
