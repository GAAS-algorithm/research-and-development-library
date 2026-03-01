import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import styles from './Sidebar.module.css'

const menuItems = [
  { path: '/dashboard', labelKey: 'nav.dashboard', icon: '📊' },
  { path: '/nobel', labelKey: 'nav.nobel', icon: '🏆' },
  { path: '/tier1-awards', labelKey: 'nav.tier1', icon: '🥇' },
  { path: '/awards', labelKey: 'nav.awards', icon: '🎖️' },
  { path: '/frontier-topics', labelKey: 'nav.frontierTopics', icon: '🔬' },
  { path: '/institutions', labelKey: 'nav.institutions', icon: '🏛️' },
  { path: '/schema', labelKey: 'nav.schema', icon: '📐' },
]

type SidebarProps = {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const { t } = useTranslation()
  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>GAAS</span>
        <span className={styles.logoText}>R&D Library</span>
        {onClose && (
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close menu"
          >
            ✕
          </button>
        )}
      </div>
      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <span className={styles.navIcon}>{item.icon}</span>
            {t(item.labelKey)}
          </NavLink>
        ))}
      </nav>
      <div className={styles.footer}>
        <p className={styles.copyright}>© TANAAKK</p>
      </div>
    </aside>
  )
}
