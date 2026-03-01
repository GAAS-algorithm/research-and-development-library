import { Link } from 'react-router-dom'
import frontierData from '../../../schema/frontier-topics.json'
import styles from './FrontierTopics.module.css'

export function FrontierTopics() {
  const topics = frontierData.topics as Array<{
    id: string
    label_ja: string
    label_en: string
    description: string
    top_institutions: string[]
    also_notable?: string[]
  }>

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Frontier Topics</h2>
      <p className={styles.desc}>
        ブレイクスルーが予測される領域。別トピックとして重点追跡。Top 20。
      </p>

      <div className={styles.index}>
        <h3 className={styles.indexTitle}>Top 20 一覧</h3>
        <div className={styles.indexList}>
          {topics.map((t) => (
            <Link key={t.id} to={`/frontier-topics/${t.id}`} className={styles.indexItem}>
              {t.label_ja}
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
              <h3 className={styles.cardTitle}>{topic.label_ja}</h3>
              <span className={styles.cardId}>{topic.id}</span>
            </div>
            <p className={styles.descText}>{topic.description}</p>
            <div className={styles.institutions}>
              <span className={styles.label}>Top 3:</span>
              {topic.top_institutions.join(', ')}
            </div>
            {topic.also_notable && topic.also_notable.length > 0 && (
              <div className={styles.alsoNotable}>
                <span className={styles.label}>Also:</span>
                {topic.also_notable.join(', ')}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
