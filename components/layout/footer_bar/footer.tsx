import styles from './footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span className={styles.logo}>DASH</span>
      <p className={styles.copy}>© 2025 DASH Studio. All rights reserved.</p>
      <ul className={styles.links}>
        <li><a href="#" className={styles.link}>Instagram</a></li>
        <li><a href="#" className={styles.link}>Behance</a></li>
        <li><a href="#" className={styles.link}>LinkedIn</a></li>
      </ul>
    </footer>
  )
}