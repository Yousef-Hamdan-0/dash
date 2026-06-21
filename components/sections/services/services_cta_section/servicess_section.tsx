import { useTranslations } from 'next-intl'
import Link from 'next/link'
import styles from './services_section.module.css'

export default function ServicesCTA({ email = 'hello@dash.studio' }: { email?: string }) {
  const t = useTranslations('services.cta')

  return (
    <section className={styles.sec}>
      <div className={styles.inner}>
        <div>
          <span className={styles.label}>{t('label')}</span>
          <h2 className={styles.h2} dangerouslySetInnerHTML={{ __html: t.raw('title') }} />
          <p className={styles.sub}>{t('body')}</p>
        </div>
        <div className={styles.btns}>
          <a href={`mailto:${email}`} className={styles.btnW}>{t('btnPrimary')} →</a>
          <Link href="/work" className={styles.btnG}>{t('btnSecondary')}</Link>
        </div>
      </div>
    </section>
  )
}
