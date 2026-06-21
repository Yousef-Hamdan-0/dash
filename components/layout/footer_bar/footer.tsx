import { getSiteSettings } from '@/lib/supabase/queries'
import { normalizeExternalUrl } from '@/lib/safe-url'
import styles from './footer.module.css'

function SocialIcon({ platform }: { platform: string }) {
  if (platform === 'instagram') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" /></svg>
  }
  if (platform === 'linkedin') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9v9M6 6.5v.01M10 18v-5a4 4 0 0 1 8 0v5M10 10v8" /></svg>
  }
  if (platform === 'behance') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h6a4 4 0 0 1 0 8H4V6Zm0 8h6a3 3 0 0 1 0 6H4v-6ZM15 8h5M15 15h6a3.5 3.5 0 1 0-1 2.5" /></svg>
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 4 14 16M19 4 5 20" /></svg>
}

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
  ].filter((s): s is { key: string; url: string } => Boolean(s.url))

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
                <SocialIcon platform={key} />
              </a>
            </li>
          ))}
        </ul>
      )}
    </footer>
  )
}
