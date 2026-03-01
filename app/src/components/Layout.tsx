import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import styles from './Layout.module.css'

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const openSidebar = () => setSidebarOpen(true)
  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className={styles.layout}>
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <div className={styles.main}>
        <Header onMenuClick={openSidebar} />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
      {sidebarOpen && (
        <button
          type="button"
          className={styles.overlay}
          onClick={closeSidebar}
          aria-label="Close menu"
        />
      )}
    </div>
  )
}
