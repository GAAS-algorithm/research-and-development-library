import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLang, pathWithLang } from '../hooks/useLang'
import frontierData from '../../../schema/frontier-topics.json'
import styles from './Sitemap.module.css'

const mainPages = [
  { path: '/dashboard', labelKey: 'nav.dashboard' },
  { path: '/nobel', labelKey: 'nav.nobel' },
  { path: '/tier1-awards', labelKey: 'nav.tier1' },
  { path: '/awards', labelKey: 'nav.awards' },
  { path: '/frontier-topics', labelKey: 'nav.frontierTopics' },
  { path: '/institutions', labelKey: 'nav.institutions' },
  { path: '/schema', labelKey: 'nav.schema' },
] as const

const topics = frontierData.topics as Array<{
  id: string
  label_ja: string
  label_en: string
}>

export function Sitemap() {
  const { t, i18n } = useTranslation()
  const lang = useLang()

  const topicLabel = (topic: { label_ja: string; label_en: string }) =>
    i18n.language === 'ja' ? topic.label_ja : topic.label_en

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>{t('sitemap.title')}</h2>
      <p className={styles.desc}>{t('sitemap.desc')}</p>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('sitemap.mainPages')}</h3>
        <ul className={styles.list}>
          {mainPages.map((item) => (
            <li key={item.path}>
              <Link to={pathWithLang(item.path, lang)} className={styles.link}>
                {t(item.labelKey)}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('sitemap.frontierTopics')}</h3>
        <ul className={styles.list}>
          {topics.map((topic) => (
            <li key={topic.id}>
              <Link
                to={pathWithLang(`/frontier-topics/${topic.id}`, lang)}
                className={styles.link}
              >
                {topicLabel(topic)}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('sitemap.languages')}</h3>
        <ul className={styles.list}>
          <li>
            <Link to={pathWithLang('/sitemap', 'en')} className={styles.link}>
              English
            </Link>
          </li>
          <li>
            <Link to={pathWithLang('/sitemap', 'ja')} className={styles.link}>
              日本語
            </Link>
          </li>
          <li>
            <Link to={pathWithLang('/sitemap', 'vi')} className={styles.link}>
              Tiếng Việt
            </Link>
          </li>
        </ul>
      </section>
    </div>
  )
}
