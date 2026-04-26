import { useTranslations } from 'next-intl'
import styles from './experience_section.module.css'
import Button from '@/components/ui/buttons/button'

const icons = ['🏥', '🚀', '✦', '🎮']

export default function ExperienceSection() {
  const t = useTranslations('experience')

  return (
    <section className={styles.sec} id="experience">
      <div className={styles.wrap}>
        <div className={styles.inner}>

          {/* LEFT */}
          <div className={styles.left}>
            <span className={styles.label}>{t('label')}</span>
            <h2 className={styles.h2} dangerouslySetInnerHTML={{ __html: t.raw('title') }} />
            <p className={styles.sub}>{t('body')}</p>
            <div className={styles.cta}>
              <Button label={t('cta')} href="#contact" variant="primary" />
            </div>
          </div>

          {/* RIGHT — cards */}
          <div className={styles.cards}>
            {icons.map((icon, i) => (
              <div key={i} className={styles.card}>
                <div className={styles.icon}>{icon}</div>
                <div>
                  <div className={styles.cardTitle}>{t(`cards.${i}.title`)}</div>
                  <div className={styles.cardBody}>{t(`cards.${i}.body`)}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
