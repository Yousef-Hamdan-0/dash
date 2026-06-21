import { getTranslations } from 'next-intl/server'
import { getSiteStats } from '@/lib/supabase/queries'
import styles from './numbers_strip.module.css'
import React from 'react'

export default async function NumbersStrip() {
  const [t, stats] = await Promise.all([
    getTranslations('numbers'),
    getSiteStats(),
  ])

  const items = [
    { val: String(stats.teamMembers),     label: t('specialists')  },
    { val: `${stats.disciplines}+`,        label: t('disciplines')  },
    { val: `${stats.projects}+`,           label: t('projects')     },
    { val: `${stats.testimonials}+`,       label: t('testimonials') },
  ]

  return (
    <div className={styles.strip}>
      <div className={styles.inner}>
        {items.map((item, i) => (
  <React.Fragment key={i}>
    <div className={styles.item}>
      <span className={styles.val}>{item.val}</span>
      <span className={styles.label}>{item.label}</span>
    </div>
    {i < items.length - 1 && (
      <div className={styles.divider} />
    )}
  </React.Fragment>
))}
      </div>
    </div>
  )
}
