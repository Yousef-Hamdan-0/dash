import Link from 'next/link'
import { getAllClients } from '@/lib/supabase/queries'
import type { DbClient } from '@/lib/supabase/queries'
import AddClientModal from './add-client-modal'
import ClientSeenMarker from './client-seen-marker'

const STATUS_LABELS: Record<DbClient['status'], string> = {
  new:       'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  closed:    'Closed',
}

const STATUS_CHIP: Record<DbClient['status'], string> = {
  new:       'dash-chip--red',
  contacted: 'dash-chip--amber',
  qualified: 'dash-chip--blue',
  closed:    'dash-chip--green',
}

const SOURCE_CHIP: Record<DbClient['source'], string> = {
  website:  'dash-chip--muted',
  services: 'dash-chip--blue',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

interface PageProps {
  searchParams: Promise<{ q?: string; status?: string; source?: string }>
}

export default async function ClientsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const query  = params.q?.trim() ?? ''
  const status = params.status ?? ''
  const source = params.source ?? ''

  const all = await getAllClients()

  const filtered = all.filter((c) => {
    if (status && c.status !== status) return false
    if (source && c.source !== source) return false
    if (!query) return true

    const q = query.toLowerCase()
    const nameMatch  = c.name.toLowerCase().startsWith(q)
    const phoneMatch = (c.phone ?? '').toLowerCase().includes(q)
    const emailMatch = c.email.toLowerCase().includes(q)
    const serviceMatch = c.service.toLowerCase().includes(q)

    return nameMatch || phoneMatch || emailMatch || serviceMatch
  })

  const unseenCount = all.filter((c) => !c.seen_at).length
  const unseenIds = all.filter((c) => !c.seen_at).map((c) => c.id).join(',')

  return (
    <div className="dash-page">
      {unseenIds && <ClientSeenMarker ids={unseenIds} />}
      <header className="dash-header">
        <div className="dash-header__main">
          <span className="dash-eyebrow">Inquiries</span>
          <h1 className="dash-title">Clients</h1>
          <p className="dash-copy">
            {all.length} total submissions
            {unseenCount > 0 && (
              <> — <span className="dash-new-badge">{unseenCount} new</span></>
            )}
          </p>
        </div>
        <AddClientModal />
      </header>

      {/* ── Filters ────────────────────────────────────────────────────────── */}
      <form method="GET" className="dash-filter-bar">
        <div className="dash-filter-search">
          <span className="dash-filter-search__icon" aria-hidden="true">⌕</span>
          <input
            name="q"
            type="search"
            defaultValue={params.q ?? ''}
            placeholder="Search name (prefix), phone, email…"
            className="dash-input dash-filter-search__input"
          />
        </div>

        <select name="status" defaultValue={status} className="dash-select dash-filter-select">
          <option value="">All statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="closed">Closed</option>
        </select>

        <select name="source" defaultValue={source} className="dash-select dash-filter-select">
          <option value="">All sources</option>
          <option value="website">Website</option>
          <option value="services">Services</option>
        </select>

        <button type="submit" className="dash-button dash-button--secondary">Filter</button>

        {(query || status || source) && (
          <Link href="/dashboard/clients" className="dash-button dash-button--ghost">Clear</Link>
        )}
      </form>

      {/* ── Table ──────────────────────────────────────────────────────────── */}
      <div className="dash-panel">
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Service</th>
                <th>Source</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {!c.seen_at && (
                        <span
                          title="New — not yet viewed"
                          style={{
                            width: 8, height: 8, borderRadius: '50%',
                            background: '#dc2626', flexShrink: 0,
                          }}
                        />
                      )}
                      <span className="dash-table__title">{c.name}</span>
                    </div>
                  </td>
                  <td className="dash-table__muted">
                    {c.phone
                      ? <a href={`tel:${c.phone}`} className="dash-link">{c.phone}</a>
                      : <span style={{ color: '#c8c8d4' }}>—</span>
                    }
                  </td>
                  <td>
                    {c.email
                      ? <a href={`mailto:${c.email}`} className="dash-link">{c.email}</a>
                      : <span style={{ color: '#c8c8d4' }}>—</span>
                    }
                  </td>
                  <td className="dash-table__muted">{c.service}</td>
                  <td>
                    <span className={`dash-chip ${SOURCE_CHIP[c.source]}`}>{c.source}</span>
                  </td>
                  <td>
                    <span className={`dash-chip ${STATUS_CHIP[c.status]}`}>
                      {STATUS_LABELS[c.status]}
                    </span>
                  </td>
                  <td className="dash-table__muted">{formatDate(c.created_at)}</td>
                  <td>
                    <Link href={`/dashboard/clients/${c.id}`} className="dash-link">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="dash-empty">
              {all.length === 0 ? 'No client inquiries yet.' : 'No results match your filters.'}
            </div>
          )}
        </div>

        {filtered.length > 0 && (
          <div className="dash-table-footer">
            Showing {filtered.length} of {all.length} records
          </div>
        )}
      </div>
    </div>
  )
}
