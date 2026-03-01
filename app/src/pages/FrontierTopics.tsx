import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import frontierData from '../../../schema/frontier-topics.json'
import styles from './FrontierTopics.module.css'

export function FrontierTopics() {
  const { t, i18n } = useTranslation()
  const topics = frontierData.topics as Array<{
    id: string
    label_ja: string
    label_en: string
    description: string
    top_institutions: string[]
    also_notable?: string[]
  }>

  const topicLabel = (topic: { label_ja: string; label_en: string }) =>
    i18n.language === 'ja' ? topic.label_ja : topic.label_en

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>{t('frontier.title')}</h2>
      <p className={styles.desc}>{t('frontier.desc')}</p>

      <div className={styles.index}>
        <h3 className={styles.indexTitle}>{t('frontier.indexTitle')}</h3>
        <div className={styles.indexList}>
          {topics.map((topic) => (
            <Link key={topic.id} to={`/frontier-topics/${topic.id}`} className={styles.indexItem}>
              {topicLabel(topic)}
            </Link>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        {topics.map((topic) => (
          <Link
            key={topic.id}
            to={`/frontier-topics/${topic.id}`}
            className={styles.card}
          >
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>{topicLabel(topic)}</h3>
              <span className={styles.cardId}>{topic.id}</span>
            </div>
            <p className={styles.descText}>{topic.description}</p>
            <div className={styles.institutions}>
              <span className={styles.label}>{t('frontier.top3')}</span>
              {topic.top_institutions.join(', ')}
            </div>
            {topic.also_notable && topic.also_notable.length > 0 && (
              <div className={styles.alsoNotable}>
                <span className={styles.label}>{t('frontier.also')}</span>
                {topic.also_notable.join(', ')}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
