import { useTranslations } from 'next-intl'
import styles from './experience_section.module.css'
import Button from '@/components/ui/buttons/button'

const icons = [
  (
    <svg key="healthcare" viewBox="0 0 28 28" aria-hidden="true">
      <path d="M6 24V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16" />
      <path d="M4 24h20M11 11h6M14 8v6M10 24v-5h8v5" />
    </svg>
  ),
  (
    <svg key="startup" viewBox="0 0 28 28" aria-hidden="true">
      <path d="M14 3.5c3.8 2.4 6 6.1 6 10.2v2.8l3 3-4.6 1.2-1.2 4.6-3-3h-2.8c-4.1 0-7.8-2.2-10.2-6 3.2-.2 6.4-1.6 9-4.2s4-5.8 4.2-8.6z" />
      <circle cx="15.5" cy="12.5" r="1.8" />
    </svg>
  ),
  (
    <svg key="brand" viewBox="0 0 28 28" aria-hidden="true">
      <path d="M5 18.5c4.2-9 10.2-13 18-12-1 7.8-5 13.8-12 18" />
      <path d="M8.5 15.5l4 4M6 22l-1.5 1.5M11 24l1.5-1.5M4 17l1.5-1.5" />
    </svg>
  ),
  (
    <svg key="interactive" viewBox="0 0 28 28" aria-hidden="true">
      <path d="M4 16a10 10 0 0 1 20 0v1.5a3.5 3.5 0 0 1-3.5 3.5h-13A3.5 3.5 0 0 1 4 17.5V16z" />
      <path d="M9.5 14v4M7.5 16h4M17.5 15h.01M20.5 17.5h.01" />
    </svg>
  ),
]

export default function ExperienceSection() {
  const t = useTranslations('experience')

  return (
    <section className={styles.sec} id="experience">
      <div className={styles.wrap}>
        <div className={styles.inner}>

          {/* LEFT */}
          <div className={styles.left}>
            <span className={styles.label}>{t('label')}</span>
            <h2 className={styles.h2} dangerouslySetInnerHTML={{ __html: t.raw('title') }} />
            <p className={styles.sub}>{t('body')}</p>
            <div className={styles.cta}>
              <Button label={t('cta')} href="#contact" variant="primary" />
            </div>
          </div>

          {/* RIGHT — cards */}
          <div className={styles.cards}>
            {icons.map((icon, i) => (
              <div key={i} className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={styles.cardNum}>0{i + 1}</span>
                  <span className={styles.icon}>{icon}</span>
                </div>
                <div className={styles.cardText}>
                  <div className={styles.cardTitle}>{t(`cards.${i}.title`)}</div>
                  <div className={styles.cardBody}>{t(`cards.${i}.body`)}</div>
                </div>
                <div className={styles.cardLine} />
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
