import { getLocale, getTranslations } from 'next-intl/server'
import { getTestimonials } from '@/lib/supabase/queries'
import styles from './testimonials_section.module.css'

export default async function TestimonialsSection() {
  const t            = await getTranslations('exp.testimonials')
  const locale       = await getLocale()
  const testimonials = await getTestimonials()
  const isAr         = locale === 'ar'

  return (
    <section className={styles.sec}>
      <div className={styles.wrap}>

        <div className={styles.hd}>
          <span className={styles.label}>{t('label')}</span>
          <h2 className={styles.h2} dangerouslySetInnerHTML={{ __html: t.raw('title') }} />
        </div>

        <div className={styles.grid}>
          {testimonials.map((item) => {
            const initials = item.author_name
              .split(' ')
              .map((n: string) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()

            const quote = isAr && item.quote_ar ? item.quote_ar : item.quote_en

            return (
              <div key={item.id} className={styles.card}>
                <p className={styles.quote}>{quote}</p>
                <div className={styles.meta}>
                  <div className={styles.avatar}>
                    <span className={styles.init}>{initials}</span>
                  </div>
                  <div>
                    <div className={styles.name}>{item.author_name}</div>
                    <div className={styles.role}>{item.author_role}</div>
                  </div>
                  <div className={styles.stars}>★★★★★</div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
