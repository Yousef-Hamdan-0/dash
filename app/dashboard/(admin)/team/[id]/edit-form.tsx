'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { updateTeamMember } from '@/app/dashboard/actions/team'
import { FormField, CheckboxField } from '@/app/dashboard/components/form-field'
import { ImageUpload } from '@/app/dashboard/components/image-upload'
import type { DbTeamMember } from '@/lib/supabase/queries'

export default function EditTeamMemberForm({ member }: { member: DbTeamMember }) {
  const action = updateTeamMember.bind(null, member.id)
  const [state, formAction, pending] = useActionState(action, undefined)

  return (
    <div className="dash-page dash-form-page">
      <div className="dash-breadcrumb">
        <Link href="/dashboard/team">Team</Link>
        <span>/</span>
        <span>{member.name}</span>
      </div>

      <header className="dash-header">
        <div className="dash-header__main">
          <span className="dash-eyebrow">People</span>
          <h1 className="dash-title">Edit team member</h1>
        </div>
      </header>

      <form action={formAction} className="dash-form">
        {state?.error && (
          <div className="dash-alert dash-alert--error">
            {state.error}
          </div>
        )}

        <div className="dash-form-card">
          <h2 className="dash-form-card__title">Details</h2>
          <div className="dash-form-grid">
            <FormField label="Full Name" name="name" value={member.name} required />
            <FormField label="Initials" name="initials" value={member.initials} required hint="Shown as avatar fallback." />
          </div>
          <div className="dash-form-grid">
            <FormField label="Role" name="role" value={member.role} required />
            <FormField label="Badge" name="badge" value={member.badge} required hint="Short label shown on card." />
          </div>
          <FormField label="Sort Order" name="sort_order" type="number" value={String(member.sort_order)} />
          <CheckboxField label="Active (shown on site)" name="active" checked={member.active} />
        </div>

        <div className="dash-form-card">
          <h2 className="dash-form-card__title">Photo</h2>
          <ImageUpload name="image_url" currentUrl={member.image_url} folder="team" />
        </div>

        <div className="dash-actions">
          <button
            type="submit"
            disabled={pending}
            className="dash-button dash-button--primary"
          >
            {pending ? 'Saving...' : 'Save Changes'}
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
