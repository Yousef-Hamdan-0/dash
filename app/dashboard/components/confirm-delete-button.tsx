'use client'

export default function ConfirmDeleteButton({
  message,
  children = 'Delete',
}: {
  message: string
  children?: React.ReactNode
}) {
  return (
    <button
      type="submit"
      className="dash-danger-link"
      onClick={(event) => {
        if (!confirm(message)) {
          event.preventDefault()
        }
      }}
    >
      {children}
    </button>
  )
}
