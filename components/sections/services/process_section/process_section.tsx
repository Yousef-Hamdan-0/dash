import { useTranslations } from 'next-intl'
import styles from './process_section.module.css'

const stepIcons = [
  <svg key="1" width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="8" r="3.5"/><path d="M4 19c0-3.866 3.134-7 7-7h1c3.866 0 7 3.134 7 7"/></svg>,
  <svg key="2" width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 17l4-4 3 3 7-9"/><rect x="2" y="2" width="18" height="18" rx="3"/></svg>,
  <svg key="3" width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M5 11l5 5 9-9"/><path d="M3 6l2 2M3 16l2-2M19 6l-2 2M19 16l-2-2"/></svg>,
]

export default function ProcessSection() {
  const t = useTranslations('services.process')

  return (
    <section className={styles.sec}>
      <div className={styles.wrap}>

        <div className={styles.hd}>
          <span className={styles.label}>{t('label')}</span>
          <h2 className={styles.h2} dangerouslySetInnerHTML={{ __html: t.raw('title') }} />
        </div>

        <div className={styles.grid}>
          {[0, 1, 2].map(i => (
            <div key={i} className={styles.step}>
              <div className={styles.stepBg}>{i + 1}</div>
              <div className={styles.icon}>{stepIcons[i]}</div>
              <span className={styles.num}>{t(`steps.${i}.num`)}</span>
              <div className={styles.title}>{t(`steps.${i}.title`)}</div>
              <p className={styles.body}>{t(`steps.${i}.body`)}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}