import { useTranslations } from 'next-intl'
import { team } from '@/lib/data/team'
import styles from './team_section.module.css'
import Image from 'next/image'

export default function TeamSection() {
  const t = useTranslations('team')

  return (
    <section className={styles.sec} id="team">
      <div className={styles.wrap}>

        <div className={styles.hd}>
          <span className={styles.label}>{t('label')}</span>
          <h2 className={styles.h2} dangerouslySetInnerHTML={{ __html: t.raw('title') }} />
          <p className={styles.sub}>{t('body')}</p>
        </div>

        <div className={styles.grid}>
          {team.map((member) => (
            <div key={member.initials} className={styles.member}>
              <div className={styles.avatar}>
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'top' }}
                  />
                ) : (
                  <>
                    <span className={styles.initials}>{member.initials}</span>
                    <span className={styles.badge}>{member.badge}</span>
                  </>
                )}
              </div>
              <div className={styles.name}>{member.name}</div>
              <div className={styles.role}>{member.role}</div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  )
}