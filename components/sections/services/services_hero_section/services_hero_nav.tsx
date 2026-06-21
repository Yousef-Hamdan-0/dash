'use client'

import { useTranslations } from 'next-intl'
import styles from './services_hero.module.css'

const serviceAnchors = ['branding', 'web', 'motion', 'systems', 'games'] as const

function scrollToService(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

export function ServicesHeroNav() {
  const t = useTranslations('services.hero')

  return (
    <div className={styles.pills}>
      {serviceAnchors.map((anchor) => (
        <button
          key={anchor}
          type="button"
          className={styles.pill}
          onClick={() => scrollToService(anchor)}
        >
          {t(`pills.${anchor}`)}
        </button>
      ))}
    </div>
  )
}

export function ServicesHeroExploreButton() {
  const t = useTranslations('services.hero')

  return (
    <button
      type="button"
      className={styles.cardBtn}
      onClick={() => scrollToService('branding')}
    >
      {t('cardBtn')} ↓
    </button>
  )
}
