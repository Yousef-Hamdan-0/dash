import Link from 'next/link'
import { getAllTestimonials } from '@/lib/supabase/queries'
import { deleteTestimonial } from '@/app/dashboard/actions/testimonials'
import ConfirmDeleteButton from '@/app/dashboard/components/confirm-delete-button'

export default async function TestimonialsPage() {
  const items = await getAllTestimonials()

  return (
    <div className="dash-page">
      <header className="dash-header">
        <div className="dash-header__main">
          <span className="dash-eyebrow">Proof</span>
          <h1 className="dash-title">Testimonials</h1>
          <p className="dash-copy">{items.length} client quotes available for the experience page.</p>
        </div>
        <Link
          href="/dashboard/testimonials/new"
          className="dash-button dash-button--primary"
        >
          <span aria-hidden="true">+</span>
          New Testimonial
        </Link>
      </header>

      <div className="dash-testimonial-list">
        {items.map((item) => (
          <div key={item.id} className="dash-testimonial-card">
            <div className="dash-testimonial-card__top">
              <div>
                <p className="dash-quote">
                  &ldquo;{item.quote_en}&rdquo;
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="dash-table__title">{item.author_name}</span>
                  <span className="dash-table__muted text-xs">{item.author_role}</span>
                  <span className={`dash-chip ${item.active ? 'dash-chip--green' : 'dash-chip--muted'}`}>
                    {item.active ? 'Active' : 'Hidden'}
                  </span>
                </div>
                {item.quote_ar && (
                  <p className="dash-quote-ar" dir="rtl">
                    &ldquo;{item.quote_ar}&rdquo;
                  </p>
                )}
              </div>
              <div className="dash-actions shrink-0">
                <Link
                  href={`/dashboard/testimonials/${item.id}`}
                  className="dash-link"
                >
                  Edit
                </Link>
                <form action={deleteTestimonial.bind(null, item.id)}>
                  <ConfirmDeleteButton message="Delete this testimonial?">
                    Delete
                  </ConfirmDeleteButton>
                </form>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="dash-empty dash-panel">No testimonials yet.</div>
        )}
      </div>
    </div>
  )
}
