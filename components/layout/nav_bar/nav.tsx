'use client'
import Image from 'next/image'
import { ASSETS } from '@/lib/constants'
import { ROUTES } from '@/lib/util/routes/string_routes'
import { Link, usePathname } from '@/lib/navigation'
import style from './nav.module.css'
import { useEffect, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'

function normalizePath(pathname: string) {
  const withoutLocale = pathname.replace(/^\/(en|ar)(?=\/|$)/, '')
  return withoutLocale || '/'
}

function getHrefHash(href: string) {
  const [, targetHash = ''] = href.split('#')
  return targetHash ? `#${targetHash}` : ''
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [hash, setHash] = useState('')
  const [languageOpen, setLanguageOpen] = useState(false)
  const languageMenuRef = useRef<HTMLLIElement>(null)
  const pathname = normalizePath(usePathname())
  const locale = useLocale()
  const t = useTranslations('nav')

  const links = [
    { label: t('home'),       href: ROUTES.home       },
    { label: t('services'),   href: ROUTES.services   },
    { label: t('work'),       href: ROUTES.work        },
    { label: t('experience'), href: ROUTES.experience  },
    { label: t('team'),       href: ROUTES.team        },
  ]

  const languageOptions = [
    { locale: 'en' as const, label: t('english'), short: 'EN' },
    { locale: 'ar' as const, label: t('arabic'),  short: 'AR' },
  ]

  const currentLanguage =
    languageOptions.find((option) => option.locale === locale) ?? languageOptions[0]
  const languageHref = `${pathname}${hash}`

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    const onHashChange = () => setHash(window.location.hash)

    onHashChange()
    window.addEventListener('scroll', onScroll)
    window.addEventListener('hashchange', onHashChange)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('hashchange', onHashChange)
    }
  }, [])

  useEffect(() => {
    if (!languageOpen) return

    const onPointerDown = (event: MouseEvent) => {
      if (!languageMenuRef.current?.contains(event.target as Node)) {
        setLanguageOpen(false)
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLanguageOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [languageOpen])

  function isActive(href: string) {
    const [targetPath] = href.split('#')
    const targetHash = getHrefHash(href)
    const normalizedTarget = normalizePath(targetPath || '/')

    if (targetHash) {
      return pathname === normalizedTarget && hash === targetHash
    }

    if (normalizedTarget === '/') {
      return pathname === '/' && !hash
    }

    return pathname === normalizedTarget || pathname.startsWith(`${normalizedTarget}/`)
  }

  function handleNavigate(href: string) {
    setHash(getHrefHash(href))
  }

  return (
    <nav className={`${style.nav} ${scrolled ? style.navScrolled : ''}`}>
      <Link href="/" className={style.logo}>
        <Image src={ASSETS.logo} alt="DASH Studio" width={120} height={32} priority />
      </Link>

      <ul className={style.links}>
        {links.map(link => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`${style.link} ${isActive(link.href) ? style.linkActive : ''}`}
              aria-current={isActive(link.href) ? 'page' : undefined}
              onClick={() => handleNavigate(link.href)}
            >
              {link.label}
            </Link>
          </li>
        ))}
        <li className={style.langItem} ref={languageMenuRef}>
          <button
            type="button"
            className={`${style.langButton} ${languageOpen ? style.langButtonOpen : ''}`}
            aria-label={t('languageMenu')}
            aria-expanded={languageOpen}
            aria-controls="language-menu"
            onClick={() => setLanguageOpen((open) => !open)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="8.5" />
              <path d="M3.5 12h17M12 3.5c2.2 2.1 3.2 5 3.2 8.5s-1 6.4-3.2 8.5M12 3.5c-2.2 2.1-3.2 5-3.2 8.5s1 6.4 3.2 8.5" />
              <path d="M17.8 18.1h3.1M17.8 20.8h3.1" />
            </svg>
            <span className={style.langButtonText}>{currentLanguage.short}</span>
          </button>

          <div
            id="language-menu"
            className={`${style.langPanel} ${languageOpen ? style.langPanelOpen : ''}`}
          >
            {languageOptions.map((option) => {
              const active = option.locale === locale

              return (
                <Link
                  key={option.locale}
                  href={languageHref}
                  locale={option.locale}
                  aria-current={active ? 'true' : undefined}
                  className={`${style.langOption} ${active ? style.langOptionActive : ''}`}
                  onClick={() => setLanguageOpen(false)}
                >
                  <span className={style.langShort}>{option.short}</span>
                  <span>{option.label}</span>
                </Link>
              )
            })}
          </div>
        </li>
        <li>
          <Link
            href={ROUTES.contact}
            className={`${style.cta} ${isActive(ROUTES.contact) ? style.ctaActive : ''}`}
            aria-current={isActive(ROUTES.contact) ? 'page' : undefined}
            onClick={() => handleNavigate(ROUTES.contact)}
          >
            {t('cta')}
          </Link>
        </li>
      </ul>
    </nav>
  )
}
