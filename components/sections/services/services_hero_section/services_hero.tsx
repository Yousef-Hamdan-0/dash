import { useTranslations } from 'next-intl'
import Link from 'next/link'
import styles from './services_hero.module.css'

export default function ServicesHero() {
  const t = useTranslations('services.hero')

  const pills = ['branding', 'web', 'motion', 'systems', 'games'] as const

  return (
    <section className={styles.sec}>
      <div className={styles.inner}>

        {/* LEFT */}
        <div>
          <span className={styles.label}>{t('label')}</span>
          <h1 className={styles.h1} dangerouslySetInnerHTML={{ __html: t.raw('title') }} />
          <p className={styles.sub}>{t('body')}</p>
          <div className={styles.pills}>
            {pills.map(p => (
              <span key={p} className={styles.pill}>{t(`pills.${p}`)}</span>
            ))}
          </div>
        </div>

        {/* RIGHT — card */}
        <div className={styles.card}>
          <div className={styles.cardNum}>05</div>
          <div className={styles.cardLine} />
          <div className={styles.cardTitle}>{t('cardTitle')}</div>
          <p className={styles.cardSub}>{t('cardSub')}</p>
          <Link href="#branding" className={styles.cardBtn}>
            {t('cardBtn')} ↓
          </Link>
        </div>

      </div>
    </section>
  )
}