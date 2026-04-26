import { useTranslations } from 'next-intl'
import styles from './numbers_strip.module.css'
import React from 'react'

export default function NumbersStrip() {
  const t = useTranslations('numbers')

  const items = [
    { val: '6',    label: t('specialists') },
    { val: '5+',   label: t('disciplines') },
    { val: '100%', label: t('ownership')   },
    { val: '∞',    label: t('ambition')    },
  ]

  return (
    <div className={styles.strip}>
      <div className={styles.inner}>
        {items.map((item, i) => (
  <React.Fragment key={i}>
    <div className={styles.item}>
      <span className={styles.val}>{item.val}</span>
      <span className={styles.label}>{item.label}</span>
    </div>
    {i < items.length - 1 && (
      <div className={styles.divider} />
    )}
  </React.Fragment>
))}
      </div>
    </div>
  )
}
