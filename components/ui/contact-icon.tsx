export type ContactIconName =
  | 'email'
  | 'phone'
  | 'whatsapp'
  | 'instagram'
  | 'linkedin'
  | 'behance'
  | 'twitter'

export default function ContactIcon({ name }: { name: ContactIconName }) {
  if (name === 'email') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m5 8 7 5 7-5" /></svg>
  }

  if (name === 'phone') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 3.5 10 8 7.8 9.7a14.5 14.5 0 0 0 6.5 6.5L16 14l4.5 2.5-.8 3a2 2 0 0 1-2 1.5C9.6 20.2 3.8 14.4 3 6.3a2 2 0 0 1 1.5-2l3-.8Z" /></svg>
  }

  if (name === 'whatsapp') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.4-4.7a8.5 8.5 0 1 1 16.1-4.1Z" /><path d="M8.2 7.6c.2-.4.4-.4.7-.4h.5c.2 0 .4 0 .5.4l.8 2c.1.3.1.5-.1.7l-.6.7c-.2.2-.2.4 0 .7.7 1.2 1.7 2.1 2.9 2.8.3.2.5.1.7-.1l.8-1c.2-.2.4-.3.7-.2l2 .9c.3.1.4.3.4.5 0 .5-.2 1.6-1.1 2.1-.7.5-1.6.7-2.7.4-1.2-.3-2.8-.9-4.7-2.6-1.6-1.4-2.6-3.2-2.9-4.3-.3-1.1 0-2 .4-2.6Z" /></svg>
  }

  if (name === 'instagram') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" /></svg>
  }

  if (name === 'linkedin') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9v9M6 6.5v.01M10 18v-5a4 4 0 0 1 8 0v5M10 10v8" /></svg>
  }

  if (name === 'behance') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h6a4 4 0 0 1 0 8H4V6Zm0 8h6a3 3 0 0 1 0 6H4v-6ZM15 8h5M15 15h6a3.5 3.5 0 1 0-1 2.5" /></svg>
  }

  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 4 14 16M19 4 5 20" /></svg>
}
