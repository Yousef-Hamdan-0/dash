import styles from './template.module.css'

export default function LocaleTemplate({ children }: { children: React.ReactNode }) {
  return <div className={styles.pageEnter}>{children}</div>
}
