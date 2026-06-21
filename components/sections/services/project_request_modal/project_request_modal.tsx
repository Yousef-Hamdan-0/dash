'use client'

import { createContext, useContext, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslations } from 'next-intl'
import styles from './project_request_modal.module.css'

interface ContactInfo {
  email: string
  phone?: string | null
  whatsapp?: string | null
  instagram?: string | null
  twitter?: string | null
  linkedin?: string | null
  behance?: string | null
}

interface ProjectRequestContextValue {
  openRequest: (serviceTitle: string) => void
}

interface ProjectRequestProviderProps {
  children: React.ReactNode
  contact: ContactInfo
}

interface ProjectRequestButtonProps {
  serviceTitle: string
  className?: string
  label: string
}

const ProjectRequestContext = createContext<ProjectRequestContextValue | null>(null)

function hasValue(value?: string | null): value is string {
  return Boolean(value?.trim())
}

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}

export function ProjectRequestProvider({ children, contact }: ProjectRequestProviderProps) {
  const t = useTranslations('services.request')
  const [target, setTarget] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const links = useMemo(() => {
    const items = [
      hasValue(contact.email) ? { label: t('emailContact'), value: contact.email, href: `mailto:${contact.email}` } : null,
      hasValue(contact.phone) ? { label: t('phoneContact'), value: contact.phone, href: phoneHref(contact.phone) } : null,
      hasValue(contact.whatsapp) ? { label: t('whatsapp'), value: t('whatsappValue'), href: contact.whatsapp } : null,
      hasValue(contact.instagram) ? { label: t('instagram'), value: contact.instagram, href: contact.instagram } : null,
      hasValue(contact.linkedin) ? { label: t('linkedin'), value: contact.linkedin, href: contact.linkedin } : null,
      hasValue(contact.behance) ? { label: t('behance'), value: contact.behance, href: contact.behance } : null,
      hasValue(contact.twitter) ? { label: t('twitter'), value: contact.twitter, href: contact.twitter } : null,
    ]

    return items.filter(Boolean) as { label: string; value: string; href: string }[]
  }, [contact, t])

  function update(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function close() {
    setTarget(null)
    setStatus('idle')
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!target || !form.name || !form.email || !form.phone || !form.message) return

    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          project: target,
          message: form.message,
          source: 'services',
        }),
      })

      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', phone: '', message: '' })
        return
      }

      setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <ProjectRequestContext.Provider value={{ openRequest: setTarget }}>
      {children}
      {target && createPortal(
        <div
          className={styles.overlay}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close()
          }}
        >
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-request-title"
          >
            <button type="button" className={styles.close} onClick={close} aria-label={t('close')}>
              x
            </button>

            <div className={styles.head}>
              <span className={styles.kicker}>{t('title')}</span>
              <h2 id="project-request-title">{target}</h2>
              <p>{t('intro')}</p>
              <div className={styles.selected}>
                <span>{t('service')}</span>
                <strong>{target}</strong>
              </div>
            </div>

            <div className={styles.body}>
              <form className={styles.form} onSubmit={submit}>
                {status === 'success' ? (
                  <div className={styles.success}>{t('success')}</div>
                ) : (
                  <>
                    <label className={styles.field}>
                      <span>{t('name')}</span>
                      <input
                        name="name"
                        type="text"
                        autoComplete="name"
                        maxLength={120}
                        placeholder={t('namePh')}
                        value={form.name}
                        onChange={update}
                        required
                      />
                    </label>
                    <label className={styles.field}>
                      <span>{t('email')}</span>
                      <input
                        name="email"
                        type="email"
                        autoComplete="email"
                        maxLength={254}
                        placeholder={t('emailPh')}
                        value={form.email}
                        onChange={update}
                        required
                      />
                    </label>
                    <label className={styles.field}>
                      <span>{t('phone')}</span>
                      <input
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        maxLength={40}
                        placeholder={t('phonePh')}
                        value={form.phone}
                        onChange={update}
                        required
                      />
                    </label>
                    <label className={styles.field}>
                      <span>{t('message')}</span>
                      <textarea
                        name="message"
                        rows={5}
                        maxLength={3000}
                        placeholder={t('messagePh')}
                        value={form.message}
                        onChange={update}
                        required
                      />
                    </label>
                    <button className={styles.submit} type="submit" disabled={status === 'loading'}>
                      {status === 'loading' ? t('sending') : t('submit')}
                      {status !== 'loading' && (
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                          <path d="M1 6.5h11M7 2l4.5 4.5L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                    {status === 'error' && <p className={styles.error}>{t('error')}</p>}
                  </>
                )}
              </form>

              <aside className={styles.contacts}>
                <h3>{t('contactTitle')}</h3>
                <p>{t('contactBody')}</p>
                <div className={styles.contactList}>
                  {links.map((link) => (
                    <a key={`${link.label}-${link.href}`} href={link.href} target="_blank" rel="noreferrer">
                      <span>{link.label}</span>
                      <strong>{link.value}</strong>
                    </a>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </div>,
        document.body
      )}
    </ProjectRequestContext.Provider>
  )
}

export function ProjectRequestButton({ serviceTitle, className, label }: ProjectRequestButtonProps) {
  const context = useContext(ProjectRequestContext)

  return (
    <button
      type="button"
      className={className}
      onClick={() => context?.openRequest(serviceTitle)}
    >
      {label}
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
        <path d="M1 6.5h11M7 2l4.5 4.5L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}
