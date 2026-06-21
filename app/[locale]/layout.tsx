import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import Nav from '@/components/layout/nav_bar/nav'
import Footer from '@/components/layout/footer_bar/footer'
import '../globals.css'

const playfair = localFont({
  src: [
    {
      path: './fonts/playfair-normal-latin.woff2',
      weight: '600 800',
      style: 'normal',
    },
    {
      path: './fonts/playfair-italic-latin.woff2',
      weight: '600 800',
      style: 'italic',
    },
  ],
  variable: '--font-playfair',
  display: 'swap',
  adjustFontFallback: 'Times New Roman',
})

const dmSans = localFont({
  src: './fonts/dm-sans-latin.woff2',
  weight: '300 500',
  style: 'normal',
  variable: '--font-dm',
  display: 'swap',
  adjustFontFallback: 'Arial',
})

export const metadata: Metadata = {
  title: 'DASH Studio',
  description: 'Creative studio — Branding, Web, Motion, Systems, Games.',
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${dmSans.variable}`}
    >
      <body>
        <NextIntlClientProvider messages={messages}>
          <Nav />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
