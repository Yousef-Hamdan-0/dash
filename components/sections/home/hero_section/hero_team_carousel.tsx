'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocale } from 'next-intl'
import styles from './hero_section.module.css'

type HeroTeamMember = {
  id: string
  initials: string
  name: string
  role: string
  badge: string
  image_url: string | null
}

const swapDuration = 560

export default function HeroTeamCarousel({ members }: { members: HeroTeamMember[] }) {
  const locale = useLocale()
  const isArabic = locale === 'ar'
  const slides = members
  const [frontIndex, setFrontIndex] = useState(0)
  const [backIndex, setBackIndex] = useState(1)
  const [swapDirection, setSwapDirection] = useState<'next' | 'previous'>('next')
  const [isSwapping, setIsSwapping] = useState(false)
  const swapTimerRef = useRef<number | null>(null)

  const normalizeIndex = useCallback((index: number) => {
    if (slides.length === 0) return 0
    return (index + slides.length) % slides.length
  }, [slides.length])

  const activeIndex = normalizeIndex(frontIndex)
  const previewIndex = normalizeIndex(backIndex)
  const activeSlide = slides[activeIndex]

  const getAdjacentIndex = useCallback((index: number, direction: 'next' | 'previous') => {
    return normalizeIndex(index + (direction === 'next' ? 1 : -1))
  }, [normalizeIndex])

  const finishSwap = useCallback((nextFrontIndex: number, direction: 'next' | 'previous') => {
    if (swapTimerRef.current) {
      window.clearTimeout(swapTimerRef.current)
    }

    swapTimerRef.current = window.setTimeout(() => {
      setIsSwapping(false)
      setBackIndex(getAdjacentIndex(nextFrontIndex, direction))
    }, swapDuration)
  }, [getAdjacentIndex])

  const showSlide = useCallback((targetIndex: number, direction: 'next' | 'previous') => {
    if (slides.length < 2) return

    const nextFrontIndex = normalizeIndex(targetIndex)
    if (nextFrontIndex === activeIndex) return

    setSwapDirection(direction)
    setIsSwapping(true)
    setBackIndex(activeIndex)
    setFrontIndex(nextFrontIndex)
    finishSwap(nextFrontIndex, direction)
  }, [activeIndex, finishSwap, normalizeIndex, slides.length])

  useEffect(() => {
    if (slides.length < 2) return

    const interval = window.setInterval(() => {
      showSlide(activeIndex + 1, 'next')
    }, 3600)

    return () => window.clearInterval(interval)
  }, [activeIndex, showSlide, slides.length])

  useEffect(() => {
    return () => {
      if (swapTimerRef.current) {
        window.clearTimeout(swapTimerRef.current)
      }
    }
  }, [])

  function showPrevious() {
    showSlide(activeIndex - 1, 'previous')
  }

  function showNext() {
    showSlide(activeIndex + 1, 'next')
  }

  function getSlideClassName(index: number) {
    const classes = [styles.carouselSlide]

    if (index === activeIndex) {
      classes.push(styles.carouselSlideFront)
    } else if (slides.length > 1 && index === previewIndex) {
      classes.push(styles.carouselSlideBack)
      classes.push(swapDirection === 'previous' ? styles.carouselSlideBackPrevious : styles.carouselSlideBackNext)
    } else {
      classes.push(styles.carouselSlideHidden)
    }

    if (isSwapping) {
      classes.push(styles.carouselSlideSwapping)
    }

    return classes.join(' ')
  }

  if (!activeSlide) return null

  return (
    <div
      className={styles.carousel}
      aria-label={isArabic ? 'صور الفريق' : 'Team photos'}
      aria-roledescription="carousel"
    >
      <div className={styles.carouselStage}>
        {slides.map((member, index) => {
          const active = index === activeIndex % slides.length

          return (
            <div
              key={member.id}
              className={getSlideClassName(index)}
              aria-hidden={!active}
            >
              {member.image_url ? (
                <div className={styles.carouselPortrait}>
                  <Image
                    src={member.image_url}
                    alt={member.name}
                    fill
                    unoptimized
                    sizes="(max-width: 900px) 70vw, 320px"
                    className={styles.carouselPortraitImage}
                  />
                  <span className={styles.carouselPortraitBadge}>{member.badge}</span>
                </div>
              ) : (
                <div className={styles.carouselFallback}>
                  <span className={styles.carouselInitials}>{member.initials}</span>
                  <span className={styles.carouselBadge}>{member.badge}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            className={`${styles.carouselArrow} ${styles.carouselArrowPrev}`}
            aria-label={isArabic ? 'صورة الفريق السابقة' : 'Previous team photo'}
            onClick={showPrevious}
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M10 3.5 5.5 8l4.5 4.5" />
            </svg>
          </button>
          <button
            type="button"
            className={`${styles.carouselArrow} ${styles.carouselArrowNext}`}
            aria-label={isArabic ? 'صورة الفريق التالية' : 'Next team photo'}
            onClick={showNext}
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="m6 3.5 4.5 4.5L6 12.5" />
            </svg>
          </button>
        </>
      )}

      <div className={styles.carouselInfo}>
        <div className={styles.carouselCopy}>
          <span className={styles.carouselName}>{activeSlide.name}</span>
          <span className={styles.carouselRole}>{activeSlide.role}</span>
        </div>
      </div>

      {slides.length > 1 && (
        <div className={styles.carouselDots}>
          {slides.map((member, index) => (
            <button
              key={member.id}
              type="button"
              className={`${styles.carouselDot} ${index === activeIndex ? styles.carouselDotActive : ''}`}
              aria-label={isArabic ? `عرض ${member.name}` : `Show ${member.name}`}
              onClick={() => showSlide(index, index > activeIndex ? 'next' : 'previous')}
            />
          ))}
        </div>
      )}
    </div>
  )
}
