import { useTranslations } from 'next-intl'
import Link from 'next/link'
import styles from './services_section.module.css'

const slugs = ['branding', 'web', 'motion', 'systems', 'games'] as const

const icons: Record<(typeof slugs)[number], React.ReactNode> = {
  branding: (
    <svg viewBox="0 0 28 28" aria-hidden="true">
      <path d="M5 22h6l11-16a3.5 3.5 0 0 0-6.2-3.2L5 19v3z" />
      <path d="M15.8 6.8l5 3.4M6.5 22l2.5-3.3" />
    </svg>
  ),
  web: (
    <svg viewBox="0 0 28 28" aria-hidden="true">
      <rect x="3.5" y="5" width="21" height="16" rx="2" />
      <path d="M2 23h24M10 21l-2-7M18 21l2-7M10.5 15h7" />
      <path d="M7 8.5h.01M10 8.5h.01M13 8.5h.01" />
    </svg>
  ),
  motion: (
    <svg viewBox="0 0 28 28" aria-hidden="true">
      <circle cx="14" cy="14" r="10.5" />
      <path d="M12 9.5l7 4.5-7 4.5v-9z" />
    </svg>
  ),
  systems: (
    <svg viewBox="0 0 28 28" aria-hidden="true">
      <rect x="4" y="4" width="8" height="8" rx="1.6" />
      <rect x="16" y="4" width="8" height="8" rx="1.6" />
      <rect x="4" y="16" width="8" height="8" rx="1.6" />
      <rect x="16" y="16" width="8" height="8" rx="1.6" />
    </svg>
  ),
  games: (
    <svg viewBox="0 0 28 28" aria-hidden="true">
      <path d="M4 16a10 10 0 0 1 20 0v1.4A3.6 3.6 0 0 1 20.4 21H7.6A3.6 3.6 0 0 1 4 17.4V16z" />
      <path d="M9.5 14v4M7.5 16h4M17.5 15h.01M20.5 17.5h.01" />
    </svg>
  ),
}

export default function ServicesListSection() {
  const t = useTranslations('servicesSection')

  return (
    <section className={styles.sec} id="services">
      <div className={styles.wrap}>

        <div className={styles.hd}>
          <div>
            <span className={styles.label}>{t('label')}</span>
            <h2 className={styles.h2} dangerouslySetInnerHTML={{ __html: t.raw('title') }} />
          </div>
          <p className={styles.body}>{t('body')}</p>
        </div>

        <div className={styles.grid}>
          {slugs.map((slug, i) => (
            <Link key={slug} href={`/services#${slug}`} className={styles.card}>
              <span className={styles.cardTop}>
                <span className={styles.num}>0{i + 1}</span>
                <span className={styles.icon}>{icons[slug]}</span>
              </span>
              <span className={styles.cardBody}>
                <span className={styles.name}>{t(`items.${i}`)}</span>
                <span className={styles.desc}>{t(`descriptions.${i}`)}</span>
              </span>
              <span className={styles.cardFoot}>
                <span>{t('cta')}</span>
                <svg className={styles.arrow} width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}
