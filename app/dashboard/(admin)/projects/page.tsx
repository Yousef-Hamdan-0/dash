import Link from 'next/link'
import { getAllProjects } from '@/lib/supabase/queries'
import { deleteProject } from '@/app/dashboard/actions/projects'
import ConfirmDeleteButton from '@/app/dashboard/components/confirm-delete-button'

export default async function ProjectsPage() {
  const projects = await getAllProjects()

  return (
    <div className="dash-page">
      <header className="dash-header">
        <div className="dash-header__main">
          <span className="dash-eyebrow">Portfolio</span>
          <h1 className="dash-title">Projects</h1>
          <p className="dash-copy">{projects.length} projects in the website archive.</p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="dash-button dash-button--primary"
        >
          <span aria-hidden="true">+</span>
          New Project
        </Link>
      </header>

      <div className="dash-panel">
        <div className="dash-table-wrap">
          <table className="dash-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Category</th>
              <th>Year</th>
              <th>State</th>
              <th>Order</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id}>
                <td className="dash-table__muted font-mono text-xs">{p.id}</td>
                <td className="dash-table__title">{p.title_en}</td>
                <td className="capitalize">
                  <span className="dash-chip dash-chip--blue">{p.category}</span>
                </td>
                <td>{p.year}</td>
                <td>
                  {p.featured && (
                    <span className="dash-chip dash-chip--amber">
                      Featured
                    </span>
                  )}
                </td>
                <td className="dash-table__muted">{p.sort_order}</td>
                <td>
                  <div className="dash-actions">
                    <Link
                      href={`/dashboard/projects/${p.id}`}
                      className="dash-link"
                    >
                      Edit
                    </Link>
                    <form action={deleteProject.bind(null, p.id)}>
                      <ConfirmDeleteButton message={`Delete "${p.title_en}"?`}>
                        Delete
                      </ConfirmDeleteButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
          {projects.length === 0 && (
            <div className="dash-empty">No projects yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}
