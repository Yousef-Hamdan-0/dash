import { useTranslations } from 'next-intl'
import Link from 'next/link'
import styles from './industries_section.module.css'

const cards = [
  { key: 'health',  colorClass: 'health'  },
  { key: 'startup', colorClass: 'startup' },
  { key: 'brand',   colorClass: 'brand'   },
  { key: 'creator', colorClass: 'creator' },
] as const

export default function IndustriesSection() {
  const t = useTranslations('exp.industries')

  return (
    <section className={styles.sec}>
      <div className={styles.wrap}>

        <div className={styles.hd}>
          <span className={styles.label}>{t('label')}</span>
          <h2 className={styles.h2} dangerouslySetInnerHTML={{ __html: t.raw('title') }} />
        </div>

        <div className={styles.grid}>
          {cards.map((c) => (
            <div key={c.key} className={`${styles.card} ${styles[c.colorClass]}`}>
              <div className={styles.top}>
                <span className={styles.num}>{t(`cards.${c.key}.num`)}</span>
                <div className={styles.title}>{t(`cards.${c.key}.title`)}</div>
              </div>
              <div className={styles.bottom}>
                <p className={styles.desc}>{t(`cards.${c.key}.desc`)}</p>
                <div className={styles.tags}>
                  {[0, 1, 2].map(i => (
                    <span key={i} className={styles.tag}>{t(`cards.${c.key}.tags.${i}`)}</span>
                  ))}
                </div>
                <Link href="/work" className={styles.link}>
                  {t('viewWork')} →
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
