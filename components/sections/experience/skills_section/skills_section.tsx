import { useTranslations } from 'next-intl'
import styles from './skills_section.module.css'

const skills = [
  { icon: '🎨', level: 95 },
  { icon: '💻', level: 90 },
  { icon: '🎬', level: 85 },
  { icon: '⚙️', level: 88 },
  { icon: '🎮', level: 80 },
] as const

export default function SkillsSection() {
  const t = useTranslations('exp.skills')

  return (
    <section className={styles.sec}>
      <div className={styles.wrap}>

        <div className={styles.hd}>
          <div>
            <span className={styles.label}>{t('label')}</span>
            <h2 className={styles.h2} dangerouslySetInnerHTML={{ __html: t.raw('title') }} />
          </div>
          <p className={styles.sub}>{t('body')}</p>
        </div>

        <div className={styles.grid}>
          {skills.map((sk, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.icon}>{sk.icon}</div>
              <div className={styles.name}>{t(`items.${i}.name`)}</div>
              <div className={styles.desc}>{t(`items.${i}.desc`)}</div>
              <div className={styles.barWrap}>
                <div className={styles.bar} style={{ '--w': `${sk.level}%` } as React.CSSProperties} />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}