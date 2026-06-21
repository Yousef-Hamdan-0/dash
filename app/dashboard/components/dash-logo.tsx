import Image from 'next/image'
import Link from 'next/link'

interface DashLogoProps {
  asLink?: boolean
  href?: string
  className?: string
}

export default function DashLogo({
  asLink = false,
  href = '/dashboard',
  className = '',
}: DashLogoProps) {
  const img = (
    <Image
      src="/images/dash.svg"
      alt="DASH Studio"
      width={72}
      height={22}
      priority
      style={{ objectFit: 'contain', objectPosition: 'left center' }}
    />
  )

  if (asLink) {
    return (
      <Link href={href} className={`dash-logo-img ${className}`} aria-label="DASH Studio">
        {img}
      </Link>
    )
  }

  return (
    <span className={`dash-logo-img ${className}`} aria-label="DASH Studio">
      {img}
    </span>
  )
}
