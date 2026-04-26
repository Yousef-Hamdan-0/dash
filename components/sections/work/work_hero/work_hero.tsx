import { useTranslations } from 'next-intl'
import styles from './work_hero.module.css'

const filters = ['all', 'branding', 'web', 'motion', 'systems', 'games'] as const

export default function WorkHero() {
  const t = useTranslations('work_page.hero')

  return (
    <section className={styles.sec}>
      <div className={styles.inner}>

        {/* LEFT */}
        <div>
          <span className={styles.label}>{t('label')}</span>
          <h1 className={styles.h1} dangerouslySetInnerHTML={{ __html: t.raw('title') }} />
          <p className={styles.sub}>{t('body')}</p>
          <div className={styles.pills}>
            {filters.map(f => (
              <span key={f} className={`${styles.pill} ${f === 'all' ? styles.pillActive : ''}`}>
                {t(`filters.${f}`)}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT — stat cards */}
        <div className={styles.statGrid}>
          <div className={styles.stat}>
            <div className={styles.statVal}>12<em>+</em></div>
            <div className={styles.statLbl}>{t('stats.projects')}</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statVal}>5</div>
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