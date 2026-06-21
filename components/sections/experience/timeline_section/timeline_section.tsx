import { getTranslations } from 'next-intl/server'
import { getJourneyItems } from '@/lib/supabase/queries'
import styles from './timeline_section.module.css'

export default async function TimelineSection() {
  const [t, items] = await Promise.all([
    getTranslations('exp.timeline'),
    getJourneyItems(),
  ])

  if (items.length === 0) return null

  return (
    <section className={styles.sec}>
      <div className={styles.wrap}>

        <div className={styles.hd}>
          <span className={styles.label}>{t('label')}</span>
          <h2 className={styles.h2} dangerouslySetInnerHTML={{ __html: t.raw('title') }} />
        </div>

        <div className={styles.tl}>
          <div className={styles.line} />
          {items.map((item, i) => (
            <div
              key={item.id}
              className={`${styles.item} ${i >= items.length - 2 ? styles.active : ''}`}
            >
              <div className={styles.dot} />
              <div className={styles.year}>{item.year}</div>
              <div className={styles.content}>
                <div className={styles.title}>{item.title}</div>
                {item.description && (
                  <p className={styles.body}>{item.description}</p>
                )}
                {item.chips.length > 0 && (
                  <div className={styles.chips}>
                    {item.chips.map((chip, j) => (
                      <span key={j} className={styles.chip}>{chip}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
