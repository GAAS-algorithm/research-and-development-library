import { NavLink } from 'react-router-dom'
import styles from './Sidebar.module.css'

const menuItems = [
  { path: '/dashboard', label: 'ダッシュボード', icon: '📊' },
  { path: '/nobel', label: 'ノーベル賞', icon: '🏆' },
  { path: '/awards', label: '研究賞', icon: '🎖️' },
  { path: '/frontier-topics', label: 'Frontier Topics', icon: '🔬' },
  { path: '/institutions', label: '機関一覧', icon: '🏛️' },
  { path: '/schema', label: 'スキーマ', icon: '📐' },
]

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>R&D</span>
        <span className={styles.logoText}>Library</span>
      </div>
      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <span className={styles.navIcon}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className={styles.footer}>
        <p className={styles.footerText}>パッケージ化できない</p>
        <p className={styles.footerText}>多次元複雑系</p>
      </div>
    </aside>
  )
}
