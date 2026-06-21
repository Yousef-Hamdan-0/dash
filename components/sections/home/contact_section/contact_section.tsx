'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import styles from './contact_section.module.css'

interface ContactSectionProps {
  teamPhone?: string | null
  teamEmail?: string | null
}

export default function ContactSection({ teamPhone, teamEmail }: ContactSectionProps) {
  const t = useTranslations('contact')

  const [form, setForm] = useState({ name: '', email: '', phone: '', project: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<Partial<typeof form>>({})

  function update(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  function validate() {
    const errs: Partial<typeof form> = {}
    if (!form.name.trim()) errs.name = t('form.nameRequired')
    if (!form.email.trim()) errs.email = t('form.emailRequired')
    if (!form.phone.trim()) errs.phone = t('form.phoneRequired')
    if (!form.project.trim()) errs.project = t('form.projectRequired')
    if (!form.message.trim()) errs.message = t('form.messageRequired')
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = t('form.emailInvalid')
    }
    return errs
  }

  async function submit() {
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setStatus('loading')
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    setStatus(res.ok ? 'success' : 'error')
  }

  const displayEmail = teamEmail || 'hello@dash.studio'

  return (
    <section className={styles.sec} id="contact">
      <div className={styles.inner}>

        {/* LEFT */}
        <div className={styles.left}>
          <span className={styles.label}>{t('label')}</span>
          <h2 className={styles.h2} dangerouslySetInnerHTML={{ __html: t.raw('title') }} />
          <p className={styles.sub}>{t('body')}</p>

          <a href={`mailto:${displayEmail}`} className={styles.email}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <rect x="2" y="3.5" width="11" height="8" rx="2" stroke="currentColor" strokeWidth="1.3" />
              <path d="M2 6l5.5 3.5L13 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            {displayEmail}
          </a>

          {teamPhone && (
            <a href={`tel:${teamPhone}`} className={styles.phone}>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M5.3 2a1 1 0 0 0-.92.62L3.47 5a1 1 0 0 0 .22 1.08l1.4 1.4a7.7 7.7 0 0 0 2.43 2.43l1.4 1.4a1 1 0 0 0 1.08.22l2.38-.91A1 1 0 0 0 13 9.7V7a1 1 0 0 0-1-1h-.5A7.5 7.5 0 0 0 5.3 2Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
              </svg>
              {teamPhone}
            </a>
          )}
        </div>

        {/* RIGHT — form */}
        <div className={styles.form}>
          {status === 'success' ? (
            <div className={styles.success}>{t('form.successMsg')}</div>
          ) : (
            <>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>{t('form.name')} <span className={styles.req}>*</span></label>
                  <input name="name" type="text" placeholder={t('form.namePh')} value={form.name} onChange={update} />
                  {errors.name && <span className={styles.fieldError}>{errors.name}</span>}
                </div>
                <div className={styles.field}>
                  <label>{t('form.phone')} <span className={styles.req}>*</span></label>
                  <input name="phone" type="tel" placeholder={t('form.phonePh')} value={form.phone} onChange={update} />
                  {errors.phone && <span className={styles.fieldError}>{errors.phone}</span>}
                </div>
              </div>
              <div className={styles.field}>
                <label>{t('form.email')} <span className={styles.req}>*</span></label>
                <input name="email" type="email" placeholder={t('form.emailPh')} value={form.email} onChange={update} />
                {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
              </div>
              <div className={styles.field}>
                <label>{t('form.project')} <span className={styles.req}>*</span></label>
                <input name="project" type="text" placeholder={t('form.projectPh')} value={form.project} onChange={update} />
                {errors.project && <span className={styles.fieldError}>{errors.project}</span>}
              </div>
              <div className={styles.field}>
                <label>{t('form.message')} <span className={styles.req}>*</span></label>
                <textarea name="message" rows={4} placeholder={t('form.messagePh')} value={form.message} onChange={update} />
                {errors.message && <span className={styles.fieldError}>{errors.message}</span>}
              </div>
              <button className={styles.submit} onClick={submit} disabled={status === 'loading'}>
                {status === 'loading' ? '...' : t('form.submit')}
                {status !== 'loading' && (
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M1 6.5h11M7 2l4.5 4.5L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              {status === 'error' && <p className={styles.error}>{t('form.errorMsg')}</p>}
            </>
          )}
        </div>

      </div>
    </section>
  )
}
