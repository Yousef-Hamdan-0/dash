'use client'

import { useTranslations } from 'next-intl'
import { useWorkFilter } from '@/lib/store/work_filter'
import type { Filter } from '@/lib/store/work_filter'
import styles from './work_filter_bar.module.css'

const filters = ['all', 'branding', 'web', 'motion', 'systems', 'games'] as const

export default function WorkFilterBar() {
  const t = useTranslations('work_page.hero.filters')
  const { active, setFilter, count } = useWorkFilter()

  return (
    <div className={styles.bar}>
      <div className={styles.inner}>
        <label className={styles.control} htmlFor="work-filter">
          <span className={styles.label}>{t('label')}</span>
          <span className={styles.selectWrap}>
            <select
              id="work-filter"
              className={styles.select}
              value={active}
              onChange={(event) => setFilter(event.target.value as Filter)}
            >
              {filters.map(f => (
                <option key={f} value={f}>
                  {t(f)}
                </option>
              ))}
            </select>
          </span>
        </label>
        <div className={styles.summary}>
          <span className={styles.current}>{t(active)}</span>
          <span className={styles.count}>{t('count', { count })}</span>
        </div>
      </div>
    </div>
  )
}
