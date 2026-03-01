import { createEffect } from 'solid-js'
import { useLocation, useParams } from '@solidjs/router'
import { useI18n } from '../contexts/I18nContext'
import { PAGE_META, LANG_BCP47 } from '../data/structuredDataConfig'
import { SITE_URL, LOGO_URL } from '../config'
import frontierData from '../../../schema/frontier-topics.json'

const SCRIPT_ID = 'gaas-structured-data'

type Lang = 'en' | 'ja' | 'vi'

const topics = frontierData.topics as Array<{
  id: string
  label_ja: string
  label_en: string
  description: string
}>

function getTopicById(id: string) {
  return topics.find((t) => t.id === id)
}

function getTopicLabel(topic: { label_ja: string; label_en: string }, lang: Lang) {
  return lang === 'ja' ? topic.label_ja : topic.label_en
}

function buildBreadcrumbs(
  segments: string[],
  topicId: string | undefined,
  lang: Lang,
  t: (key: string) => string
): Array<{ name: string; url: string }> {
  const items: Array<{ name: string; url: string }> = []
  let path = `/${lang}`

  items.push({ name: t('app.title'), url: `${SITE_URL}/${lang}/dashboard` })

  if (segments[0]) {
    const pageName = segments[0]
    const meta = PAGE_META[pageName]
    const name = meta ? t(meta.nameKey) : pageName
    path += `/${pageName}`
    items.push({ name, url: `${SITE_URL}${path}` })
  }

  if (topicId && segments[0] === 'frontier-topics') {
    const topic = getTopicById(topicId)
    if (topic) {
      path += `/${topicId}`
      items.push({ name: getTopicLabel(topic, lang), url: `${SITE_URL}${path}` })
    }
  }

  return items
}

export function StructuredData() {
  const location = useLocation()
  const params = useParams<{ lang: string; id?: string }>()
  const { t } = useI18n()

  createEffect(() => {
    const lang = (params.lang && LANG_BCP47[params.lang] ? params.lang : 'en') as Lang
    const pathWithoutLang = location.pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/dashboard'
    const segments = pathWithoutLang.split('/').filter(Boolean)
    const pageName = segments[0] || 'dashboard'

    const existing = document.getElementById(SCRIPT_ID)
    if (existing) existing.remove()

    const meta = PAGE_META[pageName]
    let webPageName = t('app.title')
    let webPageDesc = t('dashboard.desc')

    if (meta) {
      webPageName = `${t(meta.nameKey)} | ${t('app.title')}`
      webPageDesc = t(meta.descKey)
    }

    if (pageName === 'frontier-topics' && params.id) {
      const topic = getTopicById(params.id)
      if (topic) {
        webPageName = `${getTopicLabel(topic, lang)} | ${t('app.title')}`
        webPageDesc = topic.description
      }
    }

    const inLanguage = lang === 'ja' ? 'ja' : lang === 'vi' ? 'vi' : 'en'
    const breadcrumbItems = buildBreadcrumbs(segments, params.id, lang, t)

    const organization = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'TANAAKK',
      url: 'https://www.tanaakk.com/',
      logo: LOGO_URL,
    }

    const webSite = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: t('app.title'),
      url: SITE_URL,
      description: t('dashboard.desc'),
      publisher: { '@type': 'Organization', name: 'TANAAKK', url: 'https://www.tanaakk.com/' },
      inLanguage: [inLanguage, 'en', 'ja', 'vi'],
    }

    const webPage = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: webPageName,
      description: webPageDesc,
      url: `${SITE_URL}/${lang}${pathWithoutLang}`,
      publisher: { '@type': 'Organization', name: 'TANAAKK', url: 'https://www.tanaakk.com/' },
      inLanguage: inLanguage,
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbItems.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.name,
          item: item.url,
        })),
      },
    }

    const breadcrumbList = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        item: item.url,
      })),
    }

    const jsonLd = [organization, webSite, webPage, breadcrumbList]

    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(jsonLd)
    document.head.appendChild(script)

    return () => {
      const el = document.getElementById(SCRIPT_ID)
      if (el) el.remove()
    }
  })

  return null
}
