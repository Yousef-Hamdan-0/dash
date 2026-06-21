import { getLocale, getTranslations } from 'next-intl/server'
import { getTeamMembers } from '@/lib/supabase/queries'
import styles from './team_section.module.css'
import Image from 'next/image'

export default async function TeamSection() {
  const [t, locale, team] = await Promise.all([
    getTranslations('team'),
    getLocale(),
    getTeamMembers(),
  ])
  const isArabic = locale === 'ar'
  const teamHeading = isArabic
    ? `${team.length} ${team.length === 1 ? 'عقل' : 'عقول'}.`
    : `${team.length} ${team.length === 1 ? 'mind' : 'minds'}.`

  return (
    <section className={styles.sec} id="team">
      <div className={styles.wrap}>

        <div className={styles.hd}>
          <span className={styles.label}>{t('label')}</span>
          <h2 className={styles.h2}>
            {teamHeading} <em>{isArabic ? 'اتجاه واحد.' : 'One direction.'}</em>
          </h2>
          <p className={styles.sub}>{t('body')}</p>
        </div>

        <div className={styles.grid}>
          {team.map((member) => (
            <div key={member.id} className={styles.member}>
              <div className={styles.avatar}>
                {member.image_url ? (
                  <Image
                    src={member.image_url}
                    alt={member.name}
                    fill
                    unoptimized
                    sizes="160px"
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
