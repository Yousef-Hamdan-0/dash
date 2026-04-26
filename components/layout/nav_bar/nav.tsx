'use client'
import Image from 'next/image'
import { ASSETS } from '@/lib/constants'
import { ROUTES } from '@/lib/util/routes/string_routes'
import Link from 'next/link'
import style from './nav.module.css'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const t = useTranslations('nav')

  const links = [
    { label: t('home'),       href: ROUTES.home       },
    { label: t('services'),   href: ROUTES.services   },
    { label: t('work'),       href: ROUTES.work        },
    { label: t('experience'), href: ROUTES.experience  },
    { label: t('team'),       href: ROUTES.team        },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`${style.nav} ${scrolled ? style.navScrolled : ''}`}>
      <Link href="/" className={style.logo}>
        <Image src={ASSETS.logo} alt="DASH Studio" width={120} height={32} priority />
      </Link>
      <ul className={style.links}>
        {links.map(link => (
          <li key={link.href}>
            <Link href={link.href} className={style.link}>{link.label}</Link>
          </li>
        ))}
        <li>
          <Link href={ROUTES.contact} className={style.cta}>
            {t('cta')}
          </Link>
        </li>
      </ul>
    </nav>
  )
}