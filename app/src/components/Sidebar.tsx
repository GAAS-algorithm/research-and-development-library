import { NavLink } from 'react-router-dom'
import styles from './Sidebar.module.css'

const menuItems = [
  { path: '/dashboard', label: 'ダッシュボード', icon: '📊' },
  { path: '/nobel', label: 'ノーベル賞', icon: '🏆' },
  { path: '/tier1-awards', label: 'Tier1賞', icon: '🥇' },
  { path: '/awards', label: '研究賞', icon: '🎖️' },
  { path: '/frontier-topics', label: 'Frontier Topics', icon: '🔬' },
  { path: '/institutions', label: '機関一覧', icon: '🏛️' },
  { path: '/schema', label: 'スキーマ', icon: '📐' },
]

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>GAAS</span>
        <span className={styles.logoText}>R&D Library</span>
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
        <p className={styles.copyright}>© TANAAKK</p>
      </div>
    </aside>
  )
}
