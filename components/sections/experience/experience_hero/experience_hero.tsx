import { useTranslations } from 'next-intl'
import styles from './experience_hero.module.css'

const expItems = [
  { emoji: '🏥', colorClass: 'health'   },
  { emoji: '🚀', colorClass: 'startup'  },
  { emoji: '✦',  colorClass: 'brand'    },
  { emoji: '🎮', colorClass: 'creator'  },
] as const

export default function ExperienceHero() {
  const t = useTranslations('exp.hero')

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
              <div className={styles.yrNum}>5+</div>
              <div className={styles.yrLbl}>{t('yrs1')}</div>
            </div>
            <div className={styles.yrDiv} />
            <div>
              <div className={styles.yrNum}>12+</div>
              <div className={styles.yrLbl}>{t('yrs2')}</div>
            </div>
          </div>
        </div>

        {/* RIGHT — experience pills */}
        <div className={styles.list}>
          {expItems.map((item, i) => (
            <div key={i} className={`${styles.hexItem} ${styles[item.colorClass]}`}>
              <div className={styles.hexIcon}>{item.emoji}</div>
              <div className={styles.hexBody}>
                <div className={styles.hexTitle}>{t(`items.${i}.title`)}</div>
                <div className={styles.hexSub}>{t(`items.${i}.sub`)}</div>
              </div>
              <span className={styles.hexTag}>{t(`items.${i}.tag`)}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}