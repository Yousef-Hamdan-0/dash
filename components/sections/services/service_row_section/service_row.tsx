import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ServiceItem } from '@/types'
import styles from './service_row.module.css'

const icons: Record<string, React.ReactNode> = {
  branding: (
    <svg viewBox="0 0 48 48" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 40h10l18-26a5.66 5.66 0 0 0-10-5.2L8 35v5z" />
      <path d="M26 14l8 5.5M10 40l4-5.5" />
    </svg>
  ),
  web: (
    <svg viewBox="0 0 48 48" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="8" width="36" height="28" rx="3" />
      <path d="M2 40h44M16 36l-4-12M32 36l4-12M18 26h12" />
      <circle cx="12" cy="14" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="17" cy="14" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="22" cy="14" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  motion: (
    <svg viewBox="0 0 48 48" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="24" cy="24" r="20" />
      <path d="M20 16l14 8-14 8V16z" fill="currentColor" stroke="none" opacity=".9" />
    </svg>
  ),
  systems: (
    <svg viewBox="0 0 48 48" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="18" height="18" rx="3" />
      <rect x="26" y="4" width="18" height="18" rx="3" />
      <rect x="4" y="26" width="18" height="18" rx="3" />
      <rect x="26" y="26" width="18" height="18" rx="3" />
    </svg>
  ),
  games: (
    <svg viewBox="0 0 48 48" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 28a18 18 0 0 1 36 0v2a6 6 0 0 1-6 6H12a6 6 0 0 1-6-6v-2z" />
      <path d="M16 24v8M12 28h8M30 26h.01M34 30h.01" />
    </svg>
  ),
}

const vcMap: Record<string, string> = {
  light: styles.vcLight,
  blue:  styles.vcBlue,
  dark:  styles.vcDark,
}

interface Props { service: ServiceItem }

export default function ServiceRow({ service }: Props) {
  const t = useTranslations(`services.items.${service.slug}`)
  const st = useTranslations('services.shared')

  const rowClass = [
    styles.row,
    service.theme === 'alt'  ? styles.alt  : '',
    service.theme === 'dark' ? styles.dark : '',
    service.reverse          ? styles.rev  : '',
  ].join(' ')

  const vcClass = vcMap[service.vcStyle ?? 'light']

  return (
    <section className={rowClass} id={service.slug}>
      <div className={styles.inner}>

        {/* CONTENT */}
        <div className={styles.content}>
          <span className={styles.num}>{service.id} — {t('shortTitle')}</span>
          <h2 className={styles.title}>{t('title')}</h2>
          <p className={styles.tagline}>{t('tagline')}</p>
          <p className={styles.body}>{t('body')}</p>
          <ul className={styles.feats}>
            {service.features.map((_, i) => (
              <li key={i}>{t(`features.${i}`)}</li>
            ))}
          </ul>
          <Link href="#contact" className={`${styles.btn} ${service.theme === 'dark' ? styles.btnGhost : service.theme === 'alt' ? styles.btnOutline : styles.btnPrimary}`}>
            {t('cta')}
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M1 6.5h11M7 2l4.5 4.5L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* VISUAL */}
        <div className={styles.visual}>
          <div className={`${styles.visCard} ${vcClass}`}>
            <div className={styles.circle1} />
            <div className={styles.circle2} />
            <div className={styles.bgNum}>{service.id}</div>
            <div className={styles.icon}>{icons[service.slug]}</div>
            <div className={styles.visLabel}>{t('visLabel')}</div>
            <div className={styles.visSub}>{t('visSub')}</div>
            <div className={styles.visTags}>
              {service.visTags.map(tag => (
                <span key={tag} className={styles.visTag}>{tag}</span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}