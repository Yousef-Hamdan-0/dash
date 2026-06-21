import Link from 'next/link'
import Image from 'next/image'
import { getAllAnnouncements } from '@/lib/supabase/queries'
import { deleteAnnouncement } from '@/app/dashboard/actions/announcements'
import ConfirmDeleteButton from '@/app/dashboard/components/confirm-delete-button'

export default async function AnnouncementsPage() {
  const items = await getAllAnnouncements()

  return (
    <div className="dash-page">
      <header className="dash-header">
        <div className="dash-header__main">
          <span className="dash-eyebrow">Home Page</span>
          <h1 className="dash-title">Announcements</h1>
          <p className="dash-copy">
            {items.length} card{items.length !== 1 ? 's' : ''} shown in the home hero carousel.
          </p>
        </div>
        <Link href="/dashboard/announcements/new" className="dash-button dash-button--primary">
          <span aria-hidden="true">+</span>
          Add Card
        </Link>
      </header>

      <div className="dash-panel">
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Description</th>
                <th>Button</th>
                <th>Status</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.image_url ? (
                      <div style={{ width: 48, height: 36, borderRadius: 6, overflow: 'hidden', border: '1px solid #e4e5ef', position: 'relative' }}>
                        <Image src={item.image_url} alt={item.title} fill unoptimized style={{ objectFit: 'cover' }} />
                      </div>
                    ) : (
                      <span style={{ color: '#c8c8d4', fontSize: 12 }}>—</span>
                    )}
                  </td>
                  <td className="dash-table__title">{item.title}</td>
                  <td className="dash-table__muted" style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.description ?? '—'}
                  </td>
                  <td>
                    {item.button_text
                      ? <span className="dash-chip dash-chip--blue">{item.button_text}</span>
                      : <span style={{ color: '#c8c8d4', fontSize: 12 }}>—</span>
                    }
                  </td>
                  <td>
                    <span className={`dash-chip ${item.is_active ? 'dash-chip--green' : 'dash-chip--muted'}`}>
                      {item.is_active ? 'Visible' : 'Hidden'}
                    </span>
                  </td>
                  <td className="dash-table__muted">{item.sort_order}</td>
                  <td>
                    <div className="dash-actions">
                      <Link href={`/dashboard/announcements/${item.id}`} className="dash-link">Edit</Link>
                      <form action={deleteAnnouncement.bind(null, item.id)}>
                        <ConfirmDeleteButton message={`Delete "${item.title}"?`}>Delete</ConfirmDeleteButton>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && (
            <div className="dash-empty">
              No announcement cards yet. Add one to populate the home hero carousel.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
