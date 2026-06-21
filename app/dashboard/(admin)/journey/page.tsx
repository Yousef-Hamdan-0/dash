import Link from 'next/link'
import { getAllJourneyItems } from '@/lib/supabase/queries'
import { deleteJourneyItem } from '@/app/dashboard/actions/journey'
import ConfirmDeleteButton from '@/app/dashboard/components/confirm-delete-button'

export default async function JourneyPage() {
  const items = await getAllJourneyItems()

  return (
    <div className="dash-page">
      <header className="dash-header">
        <div className="dash-header__main">
          <span className="dash-eyebrow">Experience</span>
          <h1 className="dash-title">Journey</h1>
          <p className="dash-copy">{items.length} milestone{items.length !== 1 ? 's' : ''} on the public timeline.</p>
        </div>
        <Link href="/dashboard/journey/new" className="dash-button dash-button--primary">
          <span aria-hidden="true">+</span>
          Add Milestone
        </Link>
      </header>

      <div className="dash-panel">
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Year</th>
                <th>Title</th>
                <th>Tags</th>
                <th>Status</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <span className="dash-chip dash-chip--blue">{item.year}</span>
                  </td>
                  <td className="dash-table__title">{item.title}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {item.chips.map((chip, i) => (
                        <span key={i} className="dash-chip dash-chip--muted">{chip}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span className={`dash-chip ${item.is_active ? 'dash-chip--green' : 'dash-chip--muted'}`}>
                      {item.is_active ? 'Visible' : 'Hidden'}
                    </span>
                  </td>
                  <td className="dash-table__muted">{item.sort_order}</td>
                  <td>
                    <div className="dash-actions">
                      <Link href={`/dashboard/journey/${item.id}`} className="dash-link">Edit</Link>
                      <form action={deleteJourneyItem.bind(null, item.id)}>
                        <ConfirmDeleteButton message={`Delete "${item.title}" (${item.year})?`}>
                          Delete
                        </ConfirmDeleteButton>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && (
            <div className="dash-empty">No journey milestones yet. Add the first one to populate the timeline.</div>
          )}
        </div>
      </div>
    </div>
  )
}
