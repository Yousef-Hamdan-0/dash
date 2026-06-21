import styles from './hero_section.module.css'
import Button from '@/components/ui/buttons/button'
import SectionLabel from '@/components/ui/sectionlabel'
import { getTranslations } from 'next-intl/server'
import { getAnnouncements } from '@/lib/supabase/queries'
import HeroAnnouncementsCarousel from './hero_announcements_carousel'

export default async function HeroSection() {
  const [t, announcements] = await Promise.all([
    getTranslations('home_hero'),
    getAnnouncements(),
  ])

  return (
    <div className={styles.wrap}>
      <div className={styles.inner}>

        {/* LEFT */}
        <div className={styles.left}>
          <SectionLabel text={t('label')} />
          <h1 className={styles.h1}>
            {t('title')}<br />
            <span className={styles.h1Italic}>{t('subtitle')}</span>
          </h1>
          <p className={styles.sub}>{t('body')}</p>
          <div className={styles.btns}>
            <Button label={t('btnPrimary')} href="#contact" variant="primary" />
            <Button label={t('btnSecondary')} href="#work" variant="secondary" />
          </div>
        </div>

        {/* RIGHT */}
        <div className={styles.right}>
          <div className={styles.img}>
            <HeroAnnouncementsCarousel announcements={announcements} />
          </div>
          <div className={styles.badge}>
            <div className={styles.badgeIcon}>✦</div>
            <div>
              <div className={styles.badgeTitle}>{t('updatesTitle')}</div>
              <div className={styles.badgeSub}>{t('updatesSubtitle')}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
