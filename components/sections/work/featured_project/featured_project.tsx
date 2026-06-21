import Image from 'next/image'
import { getLocale, getTranslations } from 'next-intl/server'
import { getFeaturedProject } from '@/lib/supabase/queries'
import styles from './featured_project.module.css'

const catLabels: Record<string, string>   = { branding: 'Branding', web: 'Web Design', motion: 'Motion', systems: 'Systems', games: 'Games' }
const catLabelsAr: Record<string, string> = { branding: 'هوية بصرية', web: 'تصميم ويب', motion: 'حركة', systems: 'أنظمة', games: 'ألعاب' }

export default async function FeaturedProject() {
  const t        = await getTranslations('work_page.featured')
  const locale   = await getLocale()
  const featured = await getFeaturedProject()
  if (!featured) return null

  const isAr     = locale === 'ar'
  const title    = isAr && featured.title_ar ? featured.title_ar : featured.title_en
  const desc     = isAr && featured.desc_ar ? featured.desc_ar : (featured.desc_en ?? '')
  const tag      = isAr
    ? (catLabelsAr[featured.category] ?? featured.category)
    : (catLabels[featured.category] ?? featured.category)

  return (
    <section className={styles.sec}>
      <div className={styles.wrap}>

        <div className={styles.hd}>
          <span className={styles.label}>{t('label')}</span>
          <h2 className={styles.h2} dangerouslySetInnerHTML={{ __html: t.raw('title') }} />
        </div>

        <div className={styles.card}>
          {/* Image */}
          <div className={styles.img}>
            {featured.image_url ? (
              <Image
                src={featured.image_url}
                alt={title}
                fill
                unoptimized
                sizes="(max-width: 900px) 100vw, 50vw"
                className={styles.projectImage}
              />
            ) : (
              <div className={styles.imgPh}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
                  <rect x="6" y="6" width="36" height="36" rx="4"/>
                  <circle cx="17" cy="17" r="4"/>
                  <path d="M6 30l10-8 8 8 6-6 12 10"/>
                </svg>
                <span>Project Image</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className={styles.info}>
            <span className={styles.tag}>{tag}</span>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.desc}>{desc}</p>
            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <span className={styles.metaLbl}>{t('meta.client')}</span>
                <span className={styles.metaVal}>{t('meta.clientVal')}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLbl}>{t('meta.year')}</span>
                <span className={styles.metaVal}>{featured.year}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLbl}>{t('meta.scope')}</span>
                <span className={styles.metaVal}>{t('meta.scopeVal')}</span>
              </div>
            </div>
            <a href={`#project-${featured.id}`} className={styles.btn}>
              {t('btn')}
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M1 6.5h11M7 2l4.5 4.5L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}
