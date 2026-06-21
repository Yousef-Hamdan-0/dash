import { useTranslations } from 'next-intl'
import Link from 'next/link'
import styles from './work_cta.module.css'

export default function WorkCTA({ email = 'hello@dash.studio' }: { email?: string }) {
  const t = useTranslations('work_page.cta')

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
          <Link href="/services" className={styles.btnG}>{t('btnSecondary')}</Link>
        </div>
      </div>
    </section>
  )
}
