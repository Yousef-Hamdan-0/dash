import { getLocale, getTranslations } from 'next-intl/server'
import Link from 'next/link'
import Image from 'next/image'
import { getProjects } from '@/lib/supabase/queries'
import styles from './work_section.module.css'

const catLabels: Record<string, string>   = { branding: 'Branding', web: 'Web Design', motion: 'Motion', systems: 'Systems', games: 'Games' }
const catLabelsAr: Record<string, string> = { branding: 'هوية بصرية', web: 'تصميم ويب', motion: 'حركة', systems: 'أنظمة', games: 'ألعاب' }

const colorClasses: Record<string, string> = {
  brand: 'c1', web: 'c2', motion: 'c3', systems: 'c4', games: 'c5',
}

export default async function WorkSection() {
  const t        = await getTranslations('work')
  const locale   = await getLocale()
  const projects = await getProjects()
  const preview  = projects.slice(0, 6)
  const isAr     = locale === 'ar'

  if (preview.length === 0) return null

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
          {preview.map((p) => {
            const title = isAr && p.title_ar ? p.title_ar : p.title_en
            const desc  = isAr && p.desc_ar  ? p.desc_ar  : (p.desc_en ?? '')
            const cat   = isAr ? (catLabelsAr[p.category] ?? p.category) : (catLabels[p.category] ?? p.category)
            const cc    = colorClasses[p.color_class] ?? 'c1'

            return (
              <div key={p.id} className={styles.card}>
                <div className={`${styles.img} ${styles[cc]}`}>
                  {p.image_url ? (
                    <Image
                      src={p.image_url}
                      alt={title}
                      fill
                      unoptimized
                      sizes="(max-width: 900px) 100vw, 33vw"
                      className={styles.projectImage}
                    />
                  ) : (
                    <span className={styles.ph}>{cat}</span>
                  )}
                </div>
                <div className={styles.info}>
                  <span className={styles.tag}>{cat}</span>
                  <div className={styles.title}>{title}</div>
                  <div className={styles.desc}>{desc}</div>
                  <Link href={`/work#project-${p.id}`} className={styles.link}>{t('viewProject')} →</Link>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
