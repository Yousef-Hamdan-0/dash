'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { createTestimonial } from '@/app/dashboard/actions/testimonials'
import { FormField, CheckboxField } from '@/app/dashboard/components/form-field'

export default function NewTestimonialPage() {
  const [state, action, pending] = useActionState(createTestimonial, undefined)

  return (
    <div className="dash-page dash-form-page">
      <div className="dash-breadcrumb">
        <Link href="/dashboard/testimonials">Testimonials</Link>
        <span>/</span>
        <span>New</span>
      </div>

      <header className="dash-header">
        <div className="dash-header__main">
          <span className="dash-eyebrow">Proof</span>
          <h1 className="dash-title">New testimonial</h1>
        </div>
      </header>

      <form action={action} className="dash-form">
        {state?.error && (
          <div className="dash-alert dash-alert--error">
            {state.error}
          </div>
        )}

        <div className="dash-form-card">
          <h2 className="dash-form-card__title">Author</h2>
          <div className="dash-form-grid">
            <FormField label="Name" name="author_name" required placeholder="Ahmad K." />
            <FormField label="Role" name="author_role" required placeholder="Clinic Director" />
          </div>
          <div className="dash-form-grid">
            <FormField label="Sort Order" name="sort_order" type="number" value="0" />
          </div>
          <CheckboxField label="Active (shown on site)" name="active" checked />
        </div>

        <div className="dash-form-card">
          <h2 className="dash-form-card__title">Quote (English)</h2>
          <FormField
            label="Quote"
            name="quote_en"
            required
            rows={4}
            placeholder="DASH didn't just design our clinic system — they thought through every workflow we had."
          />
        </div>

        <div className="dash-form-card">
          <h2 className="dash-form-card__title">Quote (Arabic)</h2>
          <FormField label="Quote (AR)" name="quote_ar" rows={4} placeholder="داش لم تصمم نظام العيادة فحسب…" />
        </div>

        <div className="dash-actions">
          <button
            type="submit"
            disabled={pending}
            className="dash-button dash-button--primary"
          >
            {pending ? 'Creating...' : 'Create Testimonial'}
          </button>
          <Link
            href="/dashboard/testimonials"
            className="dash-button dash-button--secondary"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
