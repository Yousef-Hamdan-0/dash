'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { createProject } from '@/app/dashboard/actions/projects'
import { FormField, SelectField, CheckboxField } from '@/app/dashboard/components/form-field'
import { ImageUpload } from '@/app/dashboard/components/image-upload'

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

export default function NewProjectForm({ nextProjectId }: { nextProjectId: string }) {
  const [state, action, pending] = useActionState(createProject, undefined)

  return (
    <div className="dash-page dash-form-page">
      <div className="dash-breadcrumb">
        <Link href="/dashboard/projects">Projects</Link>
        <span>/</span>
        <span>New Project</span>
      </div>

      <header className="dash-header">
        <div className="dash-header__main">
          <span className="dash-eyebrow">Portfolio</span>
          <h1 className="dash-title">New project</h1>
        </div>
      </header>

      <form action={action} className="dash-form">
        {state?.error && (
          <div className="dash-alert dash-alert--error">
            {state.error}
          </div>
        )}

        <div className="dash-form-card">
          <h2 className="dash-form-card__title">Identity</h2>
          <div className="dash-field">
            <label htmlFor="project-id-preview" className="dash-label">
              Project ID
            </label>
            <input
              id="project-id-preview"
              type="text"
              value={nextProjectId}
              readOnly
              className="dash-input font-mono"
            />
            <p className="dash-help">
              Generated automatically when the project is created.
            </p>
          </div>
          <div className="dash-form-grid mt-5">
            <SelectField label="Category" name="category" required options={categoryOptions} />
            <SelectField label="Color Class" name="color_class" required options={colorOptions} />
          </div>
          <FormField label="Year" name="year" required placeholder="2025" />
          <FormField label="Sort Order" name="sort_order" type="number" value="0" hint="Lower numbers appear first." />
          <CheckboxField label="Featured project" name="featured" hint="Show as the featured project on the Work page." />
        </div>

        <div className="dash-form-card">
          <h2 className="dash-form-card__title">Content (English)</h2>
          <FormField label="Title (EN)" name="title_en" required placeholder="Brand Identity" />
          <FormField label="Description (EN)" name="desc_en" rows={3} placeholder="Full visual identity - logo, guidelines, and brand world." />
        </div>

        <div className="dash-form-card">
          <h2 className="dash-form-card__title">Content (Arabic)</h2>
          <FormField label="Title (AR)" name="title_ar" placeholder="هوية بصرية" />
          <FormField label="Description (AR)" name="desc_ar" rows={3} placeholder="هوية بصرية كاملة..." />
        </div>

        <div className="dash-form-card">
          <h2 className="dash-form-card__title">Cover Image</h2>
          <ImageUpload name="image_url" folder="projects" />
        </div>

        <div className="dash-actions">
          <button
            type="submit"
            disabled={pending}
            className="dash-button dash-button--primary"
          >
            {pending ? 'Creating...' : 'Create Project'}
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
