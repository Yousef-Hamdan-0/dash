'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { updateProject } from '@/app/dashboard/actions/projects'
import { FormField, SelectField, CheckboxField } from '@/app/dashboard/components/form-field'
import { ImageUpload } from '@/app/dashboard/components/image-upload'
import type { DbProject } from '@/lib/supabase/queries'

const categoryOptions = [
  { value: 'branding', label: 'Branding' },
  { value: 'web',      label: 'Web Design' },
  { value: 'motion',   label: 'Motion' },
  { value: 'systems',  label: 'Systems' },
  { value: 'games',    label: 'Games' },
]

const colorOptions = [
  { value: 'brand',   label: 'Brand (Branding)' },
  { value: 'web',     label: 'Web' },
  { value: 'motion',  label: 'Motion' },
  { value: 'systems', label: 'Systems' },
  { value: 'games',   label: 'Games' },
]

export default function EditProjectForm({ project }: { project: DbProject }) {
  const action = updateProject.bind(null, project.id)
  const [state, formAction, pending] = useActionState(action, undefined)

  return (
    <div className="dash-page dash-form-page">
      <div className="dash-breadcrumb">
        <Link href="/dashboard/projects">Projects</Link>
        <span>/</span>
        <span>{project.title_en}</span>
      </div>

      <header className="dash-header">
        <div className="dash-header__main">
          <span className="dash-eyebrow">Portfolio</span>
          <h1 className="dash-title">Edit project</h1>
        </div>
      </header>

      <form action={formAction} className="dash-form">
        {state?.error && (
          <div className="dash-alert dash-alert--error">
            {state.error}
          </div>
        )}

        <div className="dash-form-card">
          <h2 className="dash-form-card__title">Identity</h2>
          <div className="dash-field">
            <span className="dash-label">Project ID</span>
            <span className="dash-help font-mono">{project.id}</span>
          </div>
          <div className="dash-form-grid">
            <SelectField label="Category" name="category" value={project.category} required options={categoryOptions} />
            <SelectField label="Color Class" name="color_class" value={project.color_class} required options={colorOptions} />
          </div>
          <FormField label="Year" name="year" value={project.year} required />
          <FormField label="Sort Order" name="sort_order" type="number" value={String(project.sort_order)} />
          <CheckboxField label="Featured project" name="featured" checked={project.featured} />
        </div>

        <div className="dash-form-card">
          <h2 className="dash-form-card__title">Content (English)</h2>
          <FormField label="Title (EN)" name="title_en" value={project.title_en} required />
          <FormField label="Description (EN)" name="desc_en" value={project.desc_en ?? ''} rows={3} />
        </div>

        <div className="dash-form-card">
          <h2 className="dash-form-card__title">Content (Arabic)</h2>
          <FormField label="Title (AR)" name="title_ar" value={project.title_ar ?? ''} />
          <FormField label="Description (AR)" name="desc_ar" value={project.desc_ar ?? ''} rows={3} />
        </div>

        <div className="dash-form-card">
          <h2 className="dash-form-card__title">Cover Image</h2>
          <ImageUpload name="image_url" currentUrl={project.image_url} folder="projects" />
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
            href="/dashboard/projects"
            className="dash-button dash-button--secondary"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
