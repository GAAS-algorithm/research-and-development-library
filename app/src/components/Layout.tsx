import { useState, useEffect } from 'react'
import { Outlet, useParams, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { Hreflang } from './Hreflang'
import { StructuredData } from './StructuredData'
import { SUPPORTED_LANGS } from '../hooks/useLang'
import styles from './Layout.module.css'

export function Layout() {
  const { lang } = useParams<{ lang: string }>()
  const { i18n } = useTranslation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const validLang = lang && SUPPORTED_LANGS.includes(lang as 'en' | 'ja' | 'vi')

  useEffect(() => {
    if (validLang) {
      if (i18n.language !== lang) i18n.changeLanguage(lang)
      document.documentElement.lang = lang
    }
  }, [lang, validLang, i18n])

  if (!validLang) {
    return <Navigate to="/en/dashboard" replace />
  }

  const openSidebar = () => setSidebarOpen(true)
  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className={styles.layout}>
      <Hreflang />
      <StructuredData />
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
