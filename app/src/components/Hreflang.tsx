import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SUPPORTED_LANGS } from '../hooks/useLang'

export function Hreflang() {
  const location = useLocation()

  useEffect(() => {
    const base = typeof window !== 'undefined' ? window.location.origin : ''
    const path = location.pathname
    const pathWithoutLang = path.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/dashboard'

    const links: HTMLLinkElement[] = []

    SUPPORTED_LANGS.forEach((lang) => {
      const link = document.createElement('link')
      link.rel = 'alternate'
      link.hreflang = lang
      link.href = `${base}/${lang}${pathWithoutLang}`
      document.head.appendChild(link)
      links.push(link)
    })

    const defaultLink = document.createElement('link')
    defaultLink.rel = 'alternate'
    defaultLink.hreflang = 'x-default'
    defaultLink.href = `${base}/en${pathWithoutLang}`
    document.head.appendChild(defaultLink)
    links.push(defaultLink)

    return () => {
      links.forEach((link) => link.remove())
    }
  }, [location.pathname])

  return null
}
