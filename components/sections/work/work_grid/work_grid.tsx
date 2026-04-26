'use client'

import { useTranslations } from 'next-intl'
import { useWorkFilter } from '@/lib/store/work_filter'
import styles from './work_grid.module.css'

const colorMap: Record<string, string> = {
  brand:   styles.cBrand,
  web:     styles.cWeb,
  motion:  styles.cMotion,
  systems: styles.cSystems,
  games:   styles.cGames,
}

export default function WorkGrid() {
  const t = useTranslations('work_page.grid')
  const { filtered } = useWorkFilter()

  return (
    <section className={styles.sec}>
      <div className={styles.wrap}>

        <div className={styles.hd}>
          <span className={styles.label}>{t('label')}</span>
          <h2 className={styles.h2} dangerouslySetInnerHTML={{ __html: t.raw('title') }} />
        </div>

        <div className={styles.grid}>
          {filtered.map((project) => (
            <div key={project.id} className={styles.card}>
              <div className={`${styles.img} ${colorMap[project.colorClass]}`}>
                <div className={styles.imgInner}>
                  <span>{t(`projects.${project.id}.category`)}</span>
                </div>
                <div className={styles.overlay}>
                  <span className={styles.overlayTxt}>{t(`projects.${project.id}.title`)}</span>
                  <span className={styles.overlayLink}>
                    {t('viewProject')} →
                  </span>
                </div>
              </div>
              <div className={styles.info}>
                <div className={styles.top}>
                  <span className={styles.tag}>{t(`projects.${project.id}.category`)}</span>
                  <span className={styles.year}>{project.year}</span>
                </div>
                <div className={styles.title}>{t(`projects.${project.id}.title`)}</div>
                <p className={styles.desc}>{t(`projects.${project.id}.desc`)}</p>
                <a href="#" className={styles.link}>{t('viewProject')} →</a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}