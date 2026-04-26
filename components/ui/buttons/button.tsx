import styles from './Button.module.css'

interface ButtonProps {
  label: string
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost' | 'white'
}

export default function Button({
  label,
  href,
  onClick,
  variant = 'primary',
}: ButtonProps) {
  const className = `${styles.btn} ${styles[variant]}`

  if (href) {
    return (
      <a href={href} className={className}>
        {label}
      </a>
    )
  }

  return (
    <button onClick={onClick} className={className}>
      {label}
    </button>
  )
}