import styles from './Header.module.css'

export function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>R&D Library</h1>
      <p className={styles.subtitle}>世界最先端の研究開発データベース</p>
    </header>
  )
}
