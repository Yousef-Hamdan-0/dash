'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import styles from './contact_section.module.css'

export default function ContactSection() {
  const t = useTranslations('contact')

  const [form, setForm] = useState({ name: '', email: '', project: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  function update(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function submit() {
    const { name, email, project, message } = form
    if (!name || !email || !project || !message) return

    setStatus('loading')
    const res = await fetch('/api/contact', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(form),
    })

    setStatus(res.ok ? 'success' : 'error')
  }

  return (
    <section className={styles.sec} id="contact">
      <div className={styles.inner}>

        {/* LEFT — بدون تغيير */}
        <div className={styles.left}>
          <span className={styles.label}>{t('label')}</span>
          <h2 className={styles.h2} dangerouslySetInnerHTML={{ __html: t.raw('title') }} />
          <p className={styles.sub}>{t('body')}</p>
          <a href="mailto:hello@dash.studio" className={styles.email}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <rect x="2" y="3.5" width="11" height="8" rx="2" stroke="currentColor" strokeWidth="1.3" />
              <path d="M2 6l5.5 3.5L13 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            hello@dash.studio
          </a>
        </div>

        {/* RIGHT — form */}
        <div className={styles.form}>
          {status === 'success' ? (
            <div className={styles.success}>{t('form.successMsg')}</div>
          ) : (
            <>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>{t('form.name')}</label>
                  <input name="name" type="text" placeholder={t('form.namePh')} value={form.name} onChange={update} />
                </div>
                <div className={styles.field}>
                  <label>{t('form.email')}</label>
                  <input name="email" type="email" placeholder={t('form.emailPh')} value={form.email} onChange={update} />
                </div>
              </div>
              <div className={styles.field}>
                <label>{t('form.project')}</label>
                <input name="project" type="text" placeholder={t('form.projectPh')} value={form.project} onChange={update} />
              </div>
              <div className={styles.field}>
                <label>{t('form.message')}</label>
                <textarea name="message" rows={4} placeholder={t('form.messagePh')} value={form.message} onChange={update} />
              </div>
              <button
                className={styles.submit}
                onClick={submit}
                disabled={status === 'loading'}
              >
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