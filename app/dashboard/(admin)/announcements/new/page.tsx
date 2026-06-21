'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { createAnnouncement } from '@/app/dashboard/actions/announcements'
import { FormField, CheckboxField } from '@/app/dashboard/components/form-field'
import { ImageUpload } from '@/app/dashboard/components/image-upload'

export default function NewAnnouncementPage() {
  const [state, action, pending] = useActionState(createAnnouncement, undefined)

  return (
    <div className="dash-page dash-form-page">
      <div className="dash-breadcrumb">
        <Link href="/dashboard/announcements">Announcements</Link>
        <span>/</span>
        <span>New Card</span>
      </div>

      <header className="dash-header">
        <div className="dash-header__main">
          <span className="dash-eyebrow">Home Page</span>
          <h1 className="dash-title">Add Announcement Card</h1>
        </div>
      </header>

      <form action={action} className="dash-form">
        {state?.error && (
          <div className="dash-alert dash-alert--error">{state.error}</div>
        )}

        <div className="dash-form-card">
          <h2 className="dash-form-card__title">Content</h2>
          <FormField label="Title" name="title" required placeholder="New service launch" />
          <FormField
            label="Description"
            name="description"
            rows={2}
            placeholder="A brief summary shown under the title…"
          />
        </div>

        <div className="dash-form-card">
          <h2 className="dash-form-card__title">Image</h2>
          <ImageUpload name="image_url" folder="announcements" />
        </div>

        <div className="dash-form-card">
          <h2 className="dash-form-card__title">Call to Action (optional)</h2>
          <div className="dash-form-grid">
            <FormField label="Button Text" name="button_text" placeholder="Learn more" />
            <FormField label="Button URL" name="button_url" placeholder="https://…" />
          </div>
        </div>

        <div className="dash-form-card">
          <h2 className="dash-form-card__title">Settings</h2>
          <FormField label="Sort Order" name="sort_order" type="number" value="0" />
          <CheckboxField
            label="Visible on website"
            name="is_active"
            checked
            hint="Uncheck to hide this card from the home carousel."
          />
        </div>

        <div className="dash-actions">
          <button type="submit" disabled={pending} className="dash-button dash-button--primary">
            {pending ? 'Saving…' : 'Add Card'}
          </button>
          <Link href="/dashboard/announcements" className="dash-button dash-button--secondary">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
