'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { normalizeLinkHref } from '@/lib/safe-url'
import styles from './hero_section.module.css'

type Announcement = {
  id: string
  title: string
  description: string | null
  image_url: string | null
  button_text: string | null
  button_url: string | null
}

const swapDuration = 560

export default function HeroAnnouncementsCarousel({
  announcements,
}: {
  announcements: Announcement[]
}) {
  const locale = useLocale()
  const t = useTranslations('home_hero')
  const isArabic = locale === 'ar'
  const slides = announcements
  const [frontIndex, setFrontIndex] = useState(0)
  const [backIndex, setBackIndex] = useState(1)
  const [swapDirection, setSwapDirection] = useState<'next' | 'previous'>('next')
  const [isSwapping, setIsSwapping] = useState(false)
  const swapTimerRef = useRef<number | null>(null)

  const normalizeIndex = useCallback(
    (index: number) => (slides.length === 0 ? 0 : (index + slides.length) % slides.length),
    [slides.length]
  )

  const activeIndex = normalizeIndex(frontIndex)
  const previewIndex = normalizeIndex(backIndex)

  const getAdjacentIndex = useCallback(
    (index: number, direction: 'next' | 'previous') =>
      normalizeIndex(index + (direction === 'next' ? 1 : -1)),
    [normalizeIndex]
  )

  const finishSwap = useCallback(
    (nextFrontIndex: number, direction: 'next' | 'previous') => {
      if (swapTimerRef.current) window.clearTimeout(swapTimerRef.current)
      swapTimerRef.current = window.setTimeout(() => {
        setIsSwapping(false)
        setBackIndex(getAdjacentIndex(nextFrontIndex, direction))
      }, swapDuration)
    },
    [getAdjacentIndex]
  )

  const showSlide = useCallback(
    (targetIndex: number, direction: 'next' | 'previous') => {
      if (slides.length < 2) return
      const nextFrontIndex = normalizeIndex(targetIndex)
      if (nextFrontIndex === activeIndex) return
      setSwapDirection(direction)
      setIsSwapping(true)
      setBackIndex(activeIndex)
      setFrontIndex(nextFrontIndex)
      finishSwap(nextFrontIndex, direction)
    },
    [activeIndex, finishSwap, normalizeIndex, slides.length]
  )

  useEffect(() => {
    if (slides.length < 2) return
    const interval = window.setInterval(() => showSlide(activeIndex + 1, 'next'), 4000)
    return () => window.clearInterval(interval)
  }, [activeIndex, showSlide, slides.length])

  useEffect(() => () => { if (swapTimerRef.current) window.clearTimeout(swapTimerRef.current) }, [])

  function getSlideClassName(index: number) {
    const cls = [styles.carouselSlide]
    if (index === activeIndex) {
      cls.push(styles.carouselSlideFront)
    } else if (slides.length > 1 && index === previewIndex) {
      cls.push(styles.carouselSlideBack)
      cls.push(swapDirection === 'previous' ? styles.carouselSlideBackPrevious : styles.carouselSlideBackNext)
    } else {
      cls.push(styles.carouselSlideHidden)
    }
    if (isSwapping) cls.push(styles.carouselSlideSwapping)
    return cls.join(' ')
  }

  const activeSlide = slides[activeIndex]
  if (!activeSlide) {
    return (
      <div className={styles.carousel} aria-label={t('updatesTitle')}>
        <div className={styles.carouselStage}>
          <div className={`${styles.carouselSlide} ${styles.carouselSlideFront}`}>
            <div className={styles.carouselFallback}>
              <span className={styles.carouselInitials}>DASH</span>
              <span className={styles.carouselBadge}>{t('updatesTitle')}</span>
            </div>
          </div>
        </div>
        <div className={styles.carouselInfo}>
          <div className={styles.carouselCopy}>
            <span className={styles.carouselName}>{t('updateFallbackTitle')}</span>
            <span className={styles.carouselRole}>{t('updateFallbackBody')}</span>
          </div>
        </div>
      </div>
    )
  }

  const activeButtonHref = normalizeLinkHref(activeSlide.button_url)

  return (
    <div
      className={styles.carousel}
      aria-label={isArabic ? 'إعلانات وتحديثات' : 'Announcements'}
      aria-roledescription="carousel"
    >
      <div className={styles.carouselStage}>
        {slides.map((item, index) => (
          <div
            key={item.id}
            className={getSlideClassName(index)}
            aria-hidden={index !== activeIndex}
          >
            {item.image_url ? (
              <div className={styles.carouselPortrait}>
                <Image
                  src={item.image_url}
                  alt={item.title}
                  fill
                  unoptimized
                  sizes="(max-width: 900px) 70vw, 320px"
                  className={styles.carouselPortraitImage}
                />
                {item.button_text && item.button_url && (
                  <span className={styles.carouselPortraitBadge}>{item.button_text}</span>
                )}
              </div>
            ) : (
              <div className={styles.carouselFallback}>
                <span className={styles.carouselInitials} style={{ fontSize: '2rem' }}>✦</span>
                <span className={styles.carouselBadge}>{isArabic ? 'إعلان' : 'Update'}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            className={`${styles.carouselArrow} ${styles.carouselArrowPrev}`}
            aria-label={isArabic ? 'السابق' : 'Previous'}
            onClick={() => showSlide(activeIndex - 1, 'previous')}
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M10 3.5 5.5 8l4.5 4.5" />
            </svg>
          </button>
          <button
            type="button"
            className={`${styles.carouselArrow} ${styles.carouselArrowNext}`}
            aria-label={isArabic ? 'التالي' : 'Next'}
            onClick={() => showSlide(activeIndex + 1, 'next')}
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="m6 3.5 4.5 4.5L6 12.5" />
            </svg>
          </button>
        </>
      )}

      <div className={styles.carouselInfo}>
        <div className={styles.carouselCopy}>
          <span className={styles.carouselName}>{activeSlide.title}</span>
          {activeSlide.description && (
            <span className={styles.carouselRole}>{activeSlide.description}</span>
          )}
          {activeSlide.button_text && activeButtonHref && (
            <Link
              href={activeButtonHref}
              className={styles.carouselCta}
              target={activeButtonHref.startsWith('/') ? undefined : '_blank'}
              rel={activeButtonHref.startsWith('/') ? undefined : 'noopener noreferrer'}
            >
              {activeSlide.button_text} ↗
            </Link>
          )}
        </div>
      </div>

      {slides.length > 1 && (
        <div className={styles.carouselDots}>
          {slides.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={`${styles.carouselDot} ${index === activeIndex ? styles.carouselDotActive : ''}`}
              aria-label={isArabic ? `عرض ${item.title}` : `Show ${item.title}`}
              onClick={() => showSlide(index, index > activeIndex ? 'next' : 'previous')}
            />
          ))}
        </div>
      )}
    </div>
  )
}
