'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { updateTestimonial } from '@/app/dashboard/actions/testimonials'
import { FormField, CheckboxField } from '@/app/dashboard/components/form-field'
import type { DbTestimonial } from '@/lib/supabase/queries'

export default function EditTestimonialForm({ item }: { item: DbTestimonial }) {
  const action = updateTestimonial.bind(null, item.id)
  const [state, formAction, pending] = useActionState(action, undefined)

  return (
    <div className="dash-page dash-form-page">
      <div className="dash-breadcrumb">
        <Link href="/dashboard/testimonials">Testimonials</Link>
        <span>/</span>
        <span>{item.author_name}</span>
      </div>

      <header className="dash-header">
        <div className="dash-header__main">
          <span className="dash-eyebrow">Proof</span>
          <h1 className="dash-title">Edit testimonial</h1>
        </div>
      </header>

      <form action={formAction} className="dash-form">
        {state?.error && (
          <div className="dash-alert dash-alert--error">
            {state.error}
          </div>
        )}

        <div className="dash-form-card">
          <h2 className="dash-form-card__title">Author</h2>
          <div className="dash-form-grid">
            <FormField label="Name" name="author_name" value={item.author_name} required />
            <FormField label="Role" name="author_role" value={item.author_role} required />
          </div>
          <FormField label="Sort Order" name="sort_order" type="number" value={String(item.sort_order)} />
          <CheckboxField label="Active (shown on site)" name="active" checked={item.active} />
        </div>

        <div className="dash-form-card">
          <h2 className="dash-form-card__title">Quote (English)</h2>
          <FormField label="Quote" name="quote_en" value={item.quote_en} required rows={4} />
        </div>

        <div className="dash-form-card">
          <h2 className="dash-form-card__title">Quote (Arabic)</h2>
          <FormField label="Quote (AR)" name="quote_ar" value={item.quote_ar ?? ''} rows={4} />
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
