import { useParams, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import frontierData from '../../../schema/frontier-topics.json'
import styles from './FrontierTopicDetail.module.css'

type Topic = {
  id: string
  label_ja: string
  label_en: string
  description: string
  infrastructure_premise?: string
  breakthrough_reason?: string
  breakthrough_drivers?: string[]
  related_domains?: string[]
  related_fields?: string[]
  top_institutions: string[]
  also_notable?: string[]
}

const topics = frontierData.topics as Topic[]

export function FrontierTopicDetail() {
  const { t, i18n } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const topic = topics.find((t) => t.id === id)
  const currentIndex = topics.findIndex((t) => t.id === id)
  const prevTopic = currentIndex > 0 ? topics[currentIndex - 1] : null
  const nextTopic = currentIndex >= 0 && currentIndex < topics.length - 1 ? topics[currentIndex + 1] : null

  useEffect(() => {
    if (topic) {
      const label = i18n.language === 'ja' ? topic.label_ja : topic.label_en
      document.title = `${label} - Frontier Topics | GAAS R&D Library`
    }
    return () => {
      document.title = 'GAAS R&D Library'
    }
  }, [topic, i18n.language])

  if (!topic) {
    return (
      <div className={styles.page}>
        <p className={styles.notFound}>{t('frontier.notFound')}</p>
        <Link to="/frontier-topics" className={styles.backLink}>
          {t('frontier.back')}
        </Link>
      </div>
    )
  }

  const label = i18n.language === 'ja' ? topic.label_ja : topic.label_en
  const sublabel = i18n.language === 'ja' ? topic.label_en : topic.label_ja

  return (
    <div className={styles.page}>
      <Link to="/frontier-topics" className={styles.backLink}>
        {t('frontier.back')}
      </Link>

      <div className={styles.header}>
        <span className={styles.id}>{topic.id}</span>
        <h1 className={styles.title}>{label}</h1>
        <p className={styles.subtitle}>{sublabel}</p>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('frontier.overview')}</h2>
        <p className={styles.description}>{topic.description}</p>
      </section>

      {topic.infrastructure_premise && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('frontier.premise')}</h2>
          <p className={styles.description}>{topic.infrastructure_premise}</p>
        </section>
      )}

      {topic.breakthrough_reason && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('frontier.breakthroughReason')}</h2>
          <p className={styles.description}>{topic.breakthrough_reason}</p>
        </section>
      )}

      {topic.breakthrough_drivers && topic.breakthrough_drivers.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('frontier.drivers')}</h2>
          <ul className={styles.list}>
            {topic.breakthrough_drivers.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </section>
      )}

      {topic.related_domains && topic.related_domains.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('frontier.relatedDomains')}</h2>
          <p className={styles.tags}>{topic.related_domains.join(', ')}</p>
        </section>
      )}

      {topic.related_fields && topic.related_fields.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('frontier.relatedFields')}</h2>
          <p className={styles.tags}>{topic.related_fields.join(', ')}</p>
        </section>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('frontier.topInstitutions')}</h2>
        <ul className={styles.list}>
          {topic.top_institutions.map((inst) => (
            <li key={inst}>{inst}</li>
          ))}
        </ul>
      </section>

      {topic.also_notable && topic.also_notable.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('frontier.alsoNotable')}</h2>
          <p className={styles.tags}>{topic.also_notable.join(', ')}</p>
        </section>
      )}

      <nav className={styles.nav}>
        {prevTopic ? (
          <Link to={`/frontier-topics/${prevTopic.id}`} className={styles.navLink}>
            ← {i18n.language === 'ja' ? prevTopic.label_ja : prevTopic.label_en}
          </Link>
        ) : (
          <span className={styles.navDisabled}>{t('frontier.navFirst')}</span>
        )}
        <Link to="/frontier-topics" className={styles.navLink}>
          {t('frontier.navList')}
        </Link>
        {nextTopic ? (
          <Link to={`/frontier-topics/${nextTopic.id}`} className={styles.navLink}>
            {i18n.language === 'ja' ? nextTopic.label_ja : nextTopic.label_en} →
          </Link>
        ) : (
          <span className={styles.navDisabled}>{t('frontier.navLast')}</span>
        )}
      </nav>
    </div>
  )
}
