'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { createTeamMember } from '@/app/dashboard/actions/team'
import { FormField, CheckboxField } from '@/app/dashboard/components/form-field'
import { ImageUpload } from '@/app/dashboard/components/image-upload'

export default function AddTeamMemberModal() {
  const [open, setOpen] = useState(false)
  const [state, action, pending] = useActionState(createTeamMember, undefined)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const formRef   = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal()
    } else {
      dialogRef.current?.close()
      formRef.current?.reset()
    }
  }, [open])

  useEffect(() => {
    if (state?.success) {
      dialogRef.current?.close()
    }
  }, [state])

  function close() { setOpen(false) }

  return (
    <>
      <button
        type="button"
        className="dash-button dash-button--primary"
        onClick={() => setOpen(true)}
      >
        <span aria-hidden="true">+</span>
        Add Member
      </button>

      <dialog
        ref={dialogRef}
        className="dash-dialog"
        onClose={close}
        onClick={(e) => { if (e.target === e.currentTarget) close() }}
      >
        <div className="dash-dialog__panel">
          <div className="dash-dialog__head">
            <h2 className="dash-dialog__title">Add Team Member</h2>
            <button
              type="button"
              className="dash-dialog__close"
              aria-label="Close"
              onClick={close}
            >
              ✕
            </button>
          </div>

          <form ref={formRef} action={action} className="dash-dialog__body">
            {state?.error && (
              <div className="dash-alert dash-alert--error">{state.error}</div>
            )}

            <p className="dash-help" style={{ marginTop: 0 }}>
              Initials are assigned automatically (T1, T2, T3…).
            </p>

            <div className="dash-form-grid">
              <FormField label="Full Name (English)" name="name" required placeholder="Yousef Hamdan" />
              <FormField label="Role (English)" name="role" required placeholder="Full-Stack Developer" />
            </div>

            <div className="dash-form-grid">
              <FormField label="Full Name (Arabic)" name="name_ar" placeholder="يوسف حمدان" dir="rtl" />
              <FormField label="Role (Arabic)" name="role_ar" placeholder="مطور برمجيات متكامل" dir="rtl" />
            </div>

            <div className="dash-form-grid">
              <FormField label="Badge" name="badge" required placeholder="Dev" hint="Short label shown on card." />
              <FormField label="Sort Order" name="sort_order" type="number" value="0" />
            </div>

            <CheckboxField
              label="Active (shown on site)"
              name="active"
              checked
              hint="Uncheck to hide from the website without deleting."
            />

            <div>
              <p className="dash-label" style={{ marginBottom: 8 }}>Photo</p>
              <ImageUpload name="image_url" folder="team" />
            </div>

            <div className="dash-dialog__actions">
              <button
                type="submit"
                disabled={pending}
                className="dash-button dash-button--primary"
              >
                {pending ? 'Adding…' : 'Add Member'}
              </button>
              <button
                type="button"
                className="dash-button dash-button--secondary"
                onClick={close}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  )
}
