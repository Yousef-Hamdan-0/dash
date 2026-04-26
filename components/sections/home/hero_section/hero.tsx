import styles from './hero_section.module.css'
import Button from '@/components/ui/buttons/button'
import SectionLabel from '@/components/ui/sectionlabel'
import { useTranslations } from 'next-intl'



export default function HeroSection() {
  const t = useTranslations('home_hero')

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
          <div className={styles.bgShape} />
          <div className={styles.img}>
            <span className={styles.imgPlaceholder}>Team Photo</span>
          </div>
          <div className={styles.badge}>
            <div className={styles.badgeIcon}>✦</div>
            <div>
              <div className={styles.badgeTitle}>6 Specialists</div>
              <div className={styles.badgeSub}>One direction</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}