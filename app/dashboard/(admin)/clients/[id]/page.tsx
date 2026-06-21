import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getClientById } from '@/lib/supabase/queries'
import { updateClientStatus, deleteClient } from '@/app/dashboard/actions/clients'
import ConfirmDeleteButton from '@/app/dashboard/components/confirm-delete-button'
import type { DbClient } from '@/lib/supabase/queries'

const STATUS_OPTIONS: { value: DbClient['status']; label: string }[] = [
  { value: 'new',       label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'closed',    label: 'Closed' },
]

const STATUS_CHIP: Record<DbClient['status'], string> = {
  new:       'dash-chip--red',
  contacted: 'dash-chip--amber',
  qualified: 'dash-chip--blue',
  closed:    'dash-chip--green',
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ClientDetailPage({ params }: PageProps) {
  const { id } = await params
  const client = await getClientById(id)

  if (!client) notFound()

  async function handleStatusChange(formData: FormData) {
    'use server'
    const status = formData.get('status') as DbClient['status']
    if (status) await updateClientStatus(id, status)
  }

  async function handleDelete() {
    'use server'
    await deleteClient(id)
  }

  return (
    <div className="dash-page dash-form-page">
      <header className="dash-header">
        <div className="dash-header__main">
          <nav className="dash-breadcrumb">
            <Link href="/dashboard/clients">Clients</Link>
            <span aria-hidden="true">›</span>
            <span>{client.name}</span>
          </nav>
          <h1 className="dash-title" style={{ marginTop: 10 }}>{client.name}</h1>
          <p className="dash-copy">
            Received {formatDateTime(client.created_at)}
            {' · '}
            <span className={`dash-chip ${STATUS_CHIP[client.status]}`} style={{ verticalAlign: 'middle' }}>
              {client.status}
            </span>
          </p>
        </div>
        <div className="dash-header__actions">
          <a
            href={`mailto:${client.email}`}
            className="dash-button dash-button--primary"
          >
            Reply by email
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      {/* ── Contact info ─────────────────────────────────────────────────── */}
      <div className="dash-form-card">
        <h2 className="dash-form-card__title">Contact Details</h2>

        <dl className="dash-detail-grid">
          <div className="dash-detail-row">
            <dt className="dash-detail-label">Full name</dt>
            <dd className="dash-detail-value">{client.name}</dd>
          </div>
          <div className="dash-detail-row">
            <dt className="dash-detail-label">Email</dt>
            <dd className="dash-detail-value">
              <a href={`mailto:${client.email}`} className="dash-link">{client.email}</a>
            </dd>
          </div>
          {client.phone && (
            <div className="dash-detail-row">
              <dt className="dash-detail-label">Phone</dt>
              <dd className="dash-detail-value">
                <a href={`tel:${client.phone}`} className="dash-link">{client.phone}</a>
              </dd>
            </div>
          )}
          <div className="dash-detail-row">
            <dt className="dash-detail-label">Service</dt>
            <dd className="dash-detail-value">{client.service}</dd>
          </div>
          <div className="dash-detail-row">
            <dt className="dash-detail-label">Source</dt>
            <dd className="dash-detail-value capitalize">{client.source}</dd>
          </div>
          <div className="dash-detail-row">
            <dt className="dash-detail-label">Received</dt>
            <dd className="dash-detail-value">{formatDateTime(client.created_at)}</dd>
          </div>
          <div className="dash-detail-row">
            <dt className="dash-detail-label">Last updated</dt>
            <dd className="dash-detail-value">{formatDateTime(client.updated_at)}</dd>
          </div>
        </dl>
      </div>

      {/* ── Message ──────────────────────────────────────────────────────── */}
      <div className="dash-form-card">
        <h2 className="dash-form-card__title">Message</h2>
        <p className="dash-message-body">{client.message}</p>
      </div>

      {/* ── Status management ────────────────────────────────────────────── */}
      <div className="dash-form-card">
        <h2 className="dash-form-card__title">Update Status</h2>
        <form action={handleStatusChange} className="dash-status-form">
          <div className="dash-status-options">
            {STATUS_OPTIONS.map((opt) => (
              <label key={opt.value} className="dash-status-option">
                <input
                  type="radio"
                  name="status"
                  value={opt.value}
                  defaultChecked={client.status === opt.value}
                  className="dash-status-radio"
                />
                <span className={`dash-chip ${STATUS_CHIP[opt.value]}`}>
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
          <button
            type="submit"
            className="dash-button dash-button--primary"
            style={{ marginTop: 16 }}
          >
            Save status
          </button>
        </form>
      </div>

      {/* ── Danger zone ──────────────────────────────────────────────────── */}
      <div className="dash-form-card dash-danger-card">
        <h2 className="dash-form-card__title">Danger Zone</h2>
        <p className="dash-copy" style={{ marginTop: 8 }}>
          Permanently delete this record. This cannot be undone.
        </p>
        <form action={handleDelete} style={{ marginTop: 14 }}>
          <ConfirmDeleteButton message={`Delete inquiry from "${client.name}"?`}>
            Delete record
          </ConfirmDeleteButton>
        </form>
      </div>
    </div>
  )
}
