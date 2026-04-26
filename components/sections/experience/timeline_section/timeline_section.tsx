import { useTranslations } from 'next-intl'
import styles from './timeline_section.module.css'

const years = ['2020', '2021', '2022', '2023', '2024', '2025'] as const

export default function TimelineSection() {
  const t = useTranslations('exp.timeline')

  return (
    <section className={styles.sec}>
      <div className={styles.wrap}>

        <div className={styles.hd}>
          <span className={styles.label}>{t('label')}</span>
          <h2 className={styles.h2} dangerouslySetInnerHTML={{ __html: t.raw('title') }} />
        </div>

        <div className={styles.tl}>
          <div className={styles.line} />
          {years.map((yr, i) => (
            <div key={yr} className={`${styles.item} ${i >= years.length - 2 ? styles.active : ''}`}>
              <div className={styles.dot} />
              <div className={styles.year}>{yr}</div>
              <div className={styles.content}>
                <div className={styles.title}>{t(`items.${i}.title`)}</div>
                <p className={styles.body}>{t(`items.${i}.body`)}</p>
                <div className={styles.chips}>
                  {[0, 1, 2].map(j => (
                    <span key={j} className={styles.chip}>{t(`items.${i}.chips.${j}`)}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}