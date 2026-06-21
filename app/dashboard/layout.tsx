import type { Metadata } from 'next'
import localFont from 'next/font/local'
import '../globals.css'
import './dashboard.css'

const playfair = localFont({
  src: [
    {
      path: '../[locale]/fonts/playfair-normal-latin.woff2',
      weight: '600 800',
      style: 'normal',
    },
    {
      path: '../[locale]/fonts/playfair-italic-latin.woff2',
      weight: '600 800',
      style: 'italic',
    },
  ],
  variable: '--font-playfair',
  display: 'swap',
  adjustFontFallback: 'Times New Roman',
})

const dmSans = localFont({
  src: '../[locale]/fonts/dm-sans-latin.woff2',
  weight: '300 500',
  style: 'normal',
  variable: '--font-dm',
  display: 'swap',
  adjustFontFallback: 'Arial',
})

export const metadata: Metadata = { title: 'Admin — DASH Studio' }

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${dmSans.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
