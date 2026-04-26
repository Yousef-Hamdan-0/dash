import { useTranslations } from 'next-intl'
import Link from 'next/link'
import styles from './work_section.module.css'

const projects = [
  { tag: 'branding', colorClass: 'c1' },
  { tag: 'web',      colorClass: 'c2' },
  { tag: 'motion',   colorClass: 'c3' },
  { tag: 'systems',  colorClass: 'c4' },
  { tag: 'games',    colorClass: 'c5' },
  { tag: 'branding', colorClass: 'c6' },
] as const

export default function WorkSection() {
  const t = useTranslations('work')

  return (
    <section className={styles.sec} id="work">
      <div className={styles.wrap}>

        <div className={styles.hd}>
          <div>
            <span className={styles.label}>{t('label')}</span>
            <h2 className={styles.h2} dangerouslySetInnerHTML={{ __html: t.raw('title') }} />
          </div>
          <Link href="/work" className={styles.viewAll}>{t('viewAll')}</Link>
        </div>

        <div className={styles.grid}>
          {projects.map((p, i) => (
            <div key={i} className={styles.card}>
              <div className={`${styles.img} ${styles[p.colorClass]}`}>
                <span className={styles.ph}>Image Placeholder</span>
              </div>
              <div className={styles.info}>
                <span className={styles.tag}>{t(`tags.${p.tag}`)}</span>
                <div className={styles.title}>{t(`cards.${i}.title`)}</div>
                <div className={styles.desc}>{t(`cards.${i}.desc`)}</div>
                <a href="#" className={styles.link}>{t('viewProject')} →</a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
