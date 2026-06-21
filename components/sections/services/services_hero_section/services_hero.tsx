import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { ServicesHeroExploreButton, ServicesHeroNav } from './services_hero_nav'
import styles from './services_hero.module.css'

export default function ServicesHero() {
  const t = useTranslations('services.hero')

  return (
    <section className={styles.sec}>
      <div className={styles.inner}>

        {/* LEFT */}
        <div>
          <span className={styles.label}>{t('label')}</span>
          <h1 className={styles.h1} dangerouslySetInnerHTML={{ __html: t.raw('title') }} />
          <p className={styles.sub}>{t('body')}</p>
          <ServicesHeroNav />
        </div>

        {/* RIGHT — card */}
        <div className={styles.card}>
          <Image
            className={styles.cardImage}
            src="/images/services/services-hero.jpg"
            alt={t('cardTitle')}
            fill
            priority
            sizes="(max-width: 760px) 100vw, 50vw"
          />
          <div className={styles.cardShade} />
          <div className={styles.cardNum}>05</div>
          <div className={styles.cardLine} />
          <div className={styles.cardTitle}>{t('cardTitle')}</div>
          <p className={styles.cardSub}>{t('cardSub')}</p>
          <ServicesHeroExploreButton />
        </div>

      </div>
    </section>
  )
}
