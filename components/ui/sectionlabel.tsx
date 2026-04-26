interface SectionLabelProps {
  text: string
  light?: boolean
  color?: string
}

export default function SectionLabel({ text, light = false, color }: SectionLabelProps) {
  
  const defaultColor = light ? 'rgba(255,255,255,.3)' : 'var(--muted)'

  return (
    <span style={{
      fontSize: '11px',
      fontWeight: 500,
      letterSpacing: '.14em',
      textTransform: 'uppercase' as const,
      color: color ?? defaultColor,
      display: 'block',
      marginBottom: '12px',
    }}>
      {text}
    </span>
  )
}