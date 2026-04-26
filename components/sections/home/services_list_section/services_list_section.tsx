import { useTranslations } from 'next-intl'
import Link from 'next/link'
import styles from './services_section.module.css'

const slugs = ['branding', 'web', 'motion', 'systems', 'games'] as const

export default function ServicesListSection() {
  const t = useTranslations('servicesSection')

  return (
    <section className={styles.sec} id="services">
      <div className={styles.wrap}>

        <div className={styles.hd}>
          <span className={styles.label}>{t('label')}</span>
          <h2 className={styles.h2} dangerouslySetInnerHTML={{ __html: t.raw('title') }} />
        </div>

        <ul className={styles.list}>
          {slugs.map((slug, i) => (
            <li key={slug}>
              <Link href={`/services#${slug}`} className={styles.item}>
                <span className={styles.num}>0{i + 1}</span>
                <span className={styles.name}>{t(`items.${i}`)}</span>
                <svg className={styles.arrow} width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>

      </div>
    </section>
  )
}
