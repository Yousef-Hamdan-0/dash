'use client'

import { useTranslations } from 'next-intl'
import { useWorkFilter } from '@/lib/store/work_filter'
import styles from './work_filter_bar.module.css'

const filters = ['all', 'branding', 'web', 'motion', 'systems', 'games'] as const

export default function WorkFilterBar() {
  const t = useTranslations('work_page.hero.filters')
  const { active, setFilter, count } = useWorkFilter()

  return (
    <div className={styles.bar}>
      <div className={styles.inner}>
        {filters.map(f => (
          <button
            key={f}
            className={`${styles.pill} ${active === f ? styles.pillActive : ''}`}
            onClick={() => setFilter(f)}
          >
            {t(f)}
          </button>
        ))}
        <span className={styles.count}>{count} projects</span>
      </div>
    </div>
  )
}