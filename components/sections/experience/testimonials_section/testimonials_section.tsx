import { useTranslations } from 'next-intl'
import styles from './testimonials_section.module.css'

const testimonials = [
  { initials: 'AK' },
  { initials: 'SM' },
  { initials: 'RH' },
] as const

export default function TestimonialsSection() {
  const t = useTranslations('exp.testimonials')

  return (
    <section className={styles.sec}>
      <div className={styles.wrap}>

        <div className={styles.hd}>
          <span className={styles.label}>{t('label')}</span>
          <h2 className={styles.h2} dangerouslySetInnerHTML={{ __html: t.raw('title') }} />
        </div>

        <div className={styles.grid}>
          {testimonials.map((item, i) => (
            <div key={i} className={styles.card}>
              <p className={styles.quote}>{t(`items.${i}.quote`)}</p>
              <div className={styles.meta}>
                <div className={styles.avatar}>
                  <span className={styles.init}>{item.initials}</span>
                </div>
                <div>
                  <div className={styles.name}>{t(`items.${i}.name`)}</div>
                  <div className={styles.role}>{t(`items.${i}.role`)}</div>
                </div>
                <div className={styles.stars}>★★★★★</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}