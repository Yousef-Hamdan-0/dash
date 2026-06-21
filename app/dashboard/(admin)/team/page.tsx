import Image from 'next/image'
import Link from 'next/link'
import { getAllTeamMembers } from '@/lib/supabase/queries'
import { deleteTeamMember } from '@/app/dashboard/actions/team'
import ConfirmDeleteButton from '@/app/dashboard/components/confirm-delete-button'
import AddTeamMemberModal from './add-team-member-modal'

export default async function TeamPage() {
  const members = await getAllTeamMembers()

  return (
    <div className="dash-page">
      <header className="dash-header">
        <div className="dash-header__main">
          <span className="dash-eyebrow">People</span>
          <h1 className="dash-title">Team</h1>
          <p className="dash-copy">{members.length} profiles connected to the public team section.</p>
        </div>
        <AddTeamMemberModal />
      </header>

      <div className="dash-panel">
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Initials</th>
                <th>Role</th>
                <th>Badge</th>
                <th>Status</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="dash-avatar">
                        {m.image_url ? (
                          <Image src={m.image_url} alt={m.name} width={38} height={38} unoptimized className="object-cover" />
                        ) : (
                          <span>{m.initials}</span>
                        )}
                      </div>
                      <span>
                        <span className="dash-table__title">{m.name}</span>
                        {m.name_ar && <small className="dash-table__sub" lang="ar" dir="rtl">{m.name_ar}</small>}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="dash-chip dash-chip--muted">{m.initials}</span>
                  </td>
                  <td>
                    <span>{m.role}</span>
                    {m.role_ar && <small className="dash-table__sub" lang="ar" dir="rtl">{m.role_ar}</small>}
                  </td>
                  <td>
                    <span className="dash-chip dash-chip--blue">{m.badge}</span>
                  </td>
                  <td>
                    <span className={`dash-chip ${m.active ? 'dash-chip--green' : 'dash-chip--muted'}`}>
                      {m.active ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="dash-table__muted">{m.sort_order}</td>
                  <td>
                    <div className="dash-actions">
                      <Link href={`/dashboard/team/${m.id}`} className="dash-link">Edit</Link>
                      <form action={deleteTeamMember.bind(null, m.id)}>
                        <ConfirmDeleteButton message={`Remove "${m.name}"?`}>Delete</ConfirmDeleteButton>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {members.length === 0 && (
            <div className="dash-empty">No team members yet. Click &ldquo;Add Member&rdquo; to get started.</div>
          )}
        </div>
      </div>
    </div>
  )
}
