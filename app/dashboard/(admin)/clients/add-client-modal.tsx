'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { createClientManual } from '@/app/dashboard/actions/clients'

export default function AddClientModal({ quickAction = false }: { quickAction?: boolean }) {
  const [open, setOpen] = useState(false)
  const [state, action, pending] = useActionState(createClientManual, undefined)
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal()
    } else {
      dialogRef.current?.close()
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
        className={quickAction ? 'dash-quick-link dash-quick-link--primary' : 'dash-button dash-button--primary'}
        onClick={() => setOpen(true)}
      >
        {quickAction ? (
          <>
            <span className="dash-quick-icon" aria-hidden="true">+</span>
            <span className="dash-quick-copy">
              <strong>Add client</strong>
              <small>Create a client record manually</small>
            </span>
            <span className="dash-quick-arrow" aria-hidden="true">→</span>
          </>
        ) : (
          <>
            <span aria-hidden="true">+</span>
            Add Client
          </>
        )}
      </button>

      <dialog
        ref={dialogRef}
        className="dash-dialog"
        onClose={close}
        onClick={(e) => { if (e.target === e.currentTarget) close() }}
      >
        <div className="dash-dialog__panel">
          <div className="dash-dialog__head">
            <h2 className="dash-dialog__title">Add New Client</h2>
            <button
              type="button"
              className="dash-dialog__close"
              aria-label="Close"
              onClick={close}
            >
              ✕
            </button>
          </div>

          <form action={action} className="dash-dialog__body">
            {state?.error && (
              <div className="dash-alert dash-alert--error">{state.error}</div>
            )}

            <div className="dash-field">
              <label className="dash-label">
                Full Name <span className="dash-required">*</span>
              </label>
              <input name="name" type="text" className="dash-input" placeholder="John Smith" required />
            </div>

            <div className="dash-field">
              <label className="dash-label">
                Phone Number <span className="dash-required">*</span>
              </label>
              <input name="phone" type="tel" className="dash-input" placeholder="+962 7X XXX XXXX" required />
            </div>

            <div className="dash-field">
              <label className="dash-label">
                Email Address <span className="dash-required">*</span>
              </label>
              <input name="email" type="email" className="dash-input" placeholder="john@company.com" required />
            </div>

            <div className="dash-field">
              <label className="dash-label">Request / Order Type</label>
              <input
                name="request_type"
                type="text"
                className="dash-input"
                placeholder="Branding, Web, System…"
              />
            </div>

            <div className="dash-field">
              <label className="dash-label">Request Description</label>
              <textarea
                name="request_description"
                rows={3}
                className="dash-textarea"
                placeholder="Brief description of the project or request…"
              />
            </div>

            <div className="dash-dialog__actions">
              <button
                type="submit"
                disabled={pending}
                className="dash-button dash-button--primary"
              >
                {pending ? 'Saving…' : 'Add Client'}
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
