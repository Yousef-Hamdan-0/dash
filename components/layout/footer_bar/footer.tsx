import { getSiteSettings } from '@/lib/supabase/queries'
import { normalizeExternalUrl } from '@/lib/safe-url'
import ContactIcon, { type ContactIconName } from '@/components/ui/contact-icon'
import styles from './footer.module.css'

const PLATFORM_LABELS: Record<string, string> = {
  instagram: 'Instagram', linkedin: 'LinkedIn', behance: 'Behance', twitter: 'X',
}

export default async function Footer() {
  const settings = await getSiteSettings()

  const socialLinks = [
    { key: 'instagram', url: normalizeExternalUrl(settings?.instagram) },
    { key: 'linkedin',  url: normalizeExternalUrl(settings?.linkedin) },
    { key: 'behance',   url: normalizeExternalUrl(settings?.behance) },
    { key: 'twitter',   url: normalizeExternalUrl(settings?.twitter) },
  ].filter((s): s is { key: ContactIconName; url: string } => Boolean(s.url))

  return (
    <footer className={styles.footer}>
      <span className={styles.logo}>DASH</span>

      <p className={styles.copy}>© {new Date().getFullYear()} DASH Studio. All rights reserved.</p>

      {socialLinks.length > 0 && (
        <ul className={styles.links}>
          {socialLinks.map(({ key, url }) => (
            <li key={key}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={PLATFORM_LABELS[key] ?? key}
                title={PLATFORM_LABELS[key] ?? key}
              >
                <ContactIcon name={key} />
              </a>
            </li>
          ))}
        </ul>
      )}
    </footer>
  )
}
