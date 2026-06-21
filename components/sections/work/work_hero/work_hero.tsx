import { getTranslations } from 'next-intl/server'
import { getSiteStats } from '@/lib/supabase/queries'
import styles from './work_hero.module.css'

const disciplines = ['branding', 'web', 'motion', 'systems', 'games'] as const

export default async function WorkHero() {
  const [t, stats] = await Promise.all([
    getTranslations('work_page.hero'),
    getSiteStats(),
  ])

  return (
    <section className={styles.sec}>
      <div className={styles.inner}>

        {/* LEFT */}
        <div>
          <span className={styles.label}>{t('label')}</span>
          <h1 className={styles.h1} dangerouslySetInnerHTML={{ __html: t.raw('title') }} />
          <p className={styles.sub}>{t('body')}</p>
          <div className={styles.disciplineRail} aria-label={t('filters.label')}>
            <span className={styles.railLabel}>{t('filters.label')}</span>
            <ul className={styles.disciplineList}>
              {disciplines.map((discipline, index) => (
                <li key={discipline}>
                  <span className={styles.disciplineIndex}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span>{t(`filters.${discipline}`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT — stat cards */}
        <div className={styles.statGrid}>
          <div className={styles.stat}>
            <div className={styles.statVal}>{stats.projects}<em>+</em></div>
            <div className={styles.statLbl}>{t('stats.projects')}</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statVal}>{stats.disciplines}</div>
            <div className={styles.statLbl}>{t('stats.disciplines')}</div>
          </div>
          <div className={`${styles.stat} ${styles.statWide}`}>
            <div className={styles.statVal}>{t('stats.tagVal')}</div>
            <div className={styles.statDivider} />
            <div className={styles.statLbl}>{t('stats.tagLbl')}</div>
          </div>
        </div>

      </div>
    </section>
  )
}
