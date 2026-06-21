import { getTranslations } from 'next-intl/server'
import { getSiteStats } from '@/lib/supabase/queries'
import styles from './experience_hero.module.css'

const expItems = [
  { colorClass: 'health',   gradientClass: 'gradHealth'   },
  { colorClass: 'startup',  gradientClass: 'gradStartup'  },
  { colorClass: 'brand',    gradientClass: 'gradBrand'    },
  { colorClass: 'creator',  gradientClass: 'gradCreator'  },
] as const

function ExperienceIcon({ index }: { index: number }) {
  if (index === 0) {
    return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 5v22M5 16h22" /><circle cx="16" cy="16" r="11" /></svg>
  }
  if (index === 1) {
    return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M19 5c4 1 7 4 8 8l-9 9-8-8 9-9Z" /><path d="m10 14-5 2 5 3m8 3-2 5-3-5m0-5 2 2" /></svg>
  }
  if (index === 2) {
    return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="m16 4 11 12-11 12L5 16 16 4Z" /><path d="m16 10 5 6-5 6-5-6 5-6Z" /></svg>
  }
  return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M10 11h12a7 7 0 0 1 6 9l-1 4a3 3 0 0 1-5 1l-3-3h-6l-3 3a3 3 0 0 1-5-1l-1-4a7 7 0 0 1 6-9Z" /><path d="M10 15v6m-3-3h6m9-2h.01m3 4h.01" /></svg>
}

export default async function ExperienceHero() {
  const [t, stats] = await Promise.all([
    getTranslations('exp.hero'),
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
          <div className={styles.yrs}>
            <div>
              <div className={styles.yrNum}>{stats.teamMembers}</div>
              <div className={styles.yrLbl}>{t('yrs1')}</div>
            </div>
            <div className={styles.yrDiv} />
            <div>
              <div className={styles.yrNum}>{stats.projects}+</div>
              <div className={styles.yrLbl}>{t('yrs2')}</div>
            </div>
          </div>
        </div>

        {/* RIGHT — premium experience cards */}
        <div className={styles.list}>
          {expItems.map((item, i) => (
            <div key={i} className={`${styles.card} ${styles[item.colorClass]}`}>
              <div className={`${styles.cardGlow} ${styles[item.gradientClass]}`} />
              <div className={styles.cardInner}>
                <div className={styles.cardIconWrap}>
                  <div className={styles.cardIcon}><ExperienceIcon index={i} /></div>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardTitle}>{t(`items.${i}.title`)}</div>
                  <div className={styles.cardSub}>{t(`items.${i}.sub`)}</div>
                </div>
                <span className={styles.cardTag}>{t(`items.${i}.tag`)}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
