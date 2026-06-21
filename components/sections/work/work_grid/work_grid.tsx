'use client'

import { useTranslations, useLocale } from 'next-intl'
import Image from 'next/image'
import { useWorkFilter } from '@/lib/store/work_filter'
import styles from './work_grid.module.css'

const colorMap: Record<string, string> = {
  brand:   styles.cBrand,
  web:     styles.cWeb,
  motion:  styles.cMotion,
  systems: styles.cSystems,
  games:   styles.cGames,
}

const catLabels: Record<string, string>   = { branding: 'Branding', web: 'Web Design', motion: 'Motion', systems: 'Systems', games: 'Games' }
const catLabelsAr: Record<string, string> = { branding: 'هوية بصرية', web: 'تصميم ويب', motion: 'حركة', systems: 'أنظمة', games: 'ألعاب' }

export default function WorkGrid() {
  const t      = useTranslations('work_page.grid')
  const locale = useLocale()
  const { filtered } = useWorkFilter()
  const isAr = locale === 'ar'

  return (
    <section className={styles.sec}>
      <div className={styles.wrap}>

        <div className={styles.hd}>
          <span className={styles.label}>{t('label')}</span>
          <h2 className={styles.h2} dangerouslySetInnerHTML={{ __html: t.raw('title') }} />
        </div>

        <div className={styles.grid}>
          {filtered.map((project) => {
            const title = isAr && project.title_ar ? project.title_ar : project.title_en
            const desc  = isAr && project.desc_ar  ? project.desc_ar  : (project.desc_en ?? '')
            const cat   = isAr
              ? (catLabelsAr[project.category] ?? project.category)
              : (catLabels[project.category]   ?? project.category)

            return (
              <div key={project.id} className={styles.card}>
                <div className={`${styles.img} ${colorMap[project.color_class]}`}>
                  {project.image_url ? (
                    <Image
                      src={project.image_url}
                      alt={title}
                      fill
                      unoptimized
                      sizes="(max-width: 900px) 100vw, 33vw"
                      className={styles.projectImage}
                    />
                  ) : (
                    <div className={styles.imgInner}>
                      <span>{cat}</span>
                    </div>
                  )}
                  <div className={styles.overlay}>
                    <span className={styles.overlayTxt}>{title}</span>
                    <span className={styles.overlayLink}>{t('viewProject')} →</span>
                  </div>
                </div>
                <div className={styles.info}>
                  <div className={styles.top}>
                    <span className={styles.tag}>{cat}</span>
                    <span className={styles.year}>{project.year}</span>
                  </div>
                  <div className={styles.title}>{title}</div>
                  <p className={styles.desc}>{desc}</p>
                  <a href="#" className={styles.link}>{t('viewProject')} →</a>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
