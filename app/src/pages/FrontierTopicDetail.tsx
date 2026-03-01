import { useParams, Link } from 'react-router-dom'
import { useEffect } from 'react'
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
  const { id } = useParams<{ id: string }>()
  const topic = topics.find((t) => t.id === id)
  const currentIndex = topics.findIndex((t) => t.id === id)
  const prevTopic = currentIndex > 0 ? topics[currentIndex - 1] : null
  const nextTopic = currentIndex >= 0 && currentIndex < topics.length - 1 ? topics[currentIndex + 1] : null

  useEffect(() => {
    if (topic) {
      document.title = `${topic.label_ja} - Frontier Topics | GAAS R&D Library`
    }
    return () => {
      document.title = 'GAAS R&D Library'
    }
  }, [topic])

  if (!topic) {
    return (
      <div className={styles.page}>
        <p className={styles.notFound}>トピックが見つかりません。</p>
        <Link to="/frontier-topics" className={styles.backLink}>
          ← Frontier Topics に戻る
        </Link>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Link to="/frontier-topics" className={styles.backLink}>
        ← Frontier Topics に戻る
      </Link>

      <div className={styles.header}>
        <span className={styles.id}>{topic.id}</span>
        <h1 className={styles.title}>{topic.label_ja}</h1>
        <p className={styles.subtitle}>{topic.label_en}</p>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>概要</h2>
        <p className={styles.description}>{topic.description}</p>
      </section>

      {topic.infrastructure_premise && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>前提条件：現在の社会インフラの限界</h2>
          <p className={styles.description}>{topic.infrastructure_premise}</p>
        </section>
      )}

      {topic.breakthrough_reason && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>ブレイクスルーになりうる理由</h2>
          <p className={styles.description}>{topic.breakthrough_reason}</p>
        </section>
      )}

      {topic.breakthrough_drivers && topic.breakthrough_drivers.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>ブレイクスルー要因</h2>
          <ul className={styles.list}>
            {topic.breakthrough_drivers.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </section>
      )}

      {topic.related_domains && topic.related_domains.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>関連ドメイン</h2>
          <p className={styles.tags}>{topic.related_domains.join(', ')}</p>
        </section>
      )}

      {topic.related_fields && topic.related_fields.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>関連分野</h2>
          <p className={styles.tags}>{topic.related_fields.join(', ')}</p>
        </section>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Top 機関</h2>
        <ul className={styles.list}>
          {topic.top_institutions.map((inst) => (
            <li key={inst}>{inst}</li>
          ))}
        </ul>
      </section>

      {topic.also_notable && topic.also_notable.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Also Notable</h2>
          <p className={styles.tags}>{topic.also_notable.join(', ')}</p>
        </section>
      )}

      <nav className={styles.nav}>
        {prevTopic ? (
          <Link to={`/frontier-topics/${prevTopic.id}`} className={styles.navLink}>
            ← {prevTopic.label_ja}
          </Link>
        ) : (
          <span className={styles.navDisabled}>← 最初</span>
        )}
        <Link to="/frontier-topics" className={styles.navLink}>
          一覧
        </Link>
        {nextTopic ? (
          <Link to={`/frontier-topics/${nextTopic.id}`} className={styles.navLink}>
            {nextTopic.label_ja} →
          </Link>
        ) : (
          <span className={styles.navDisabled}>最後 →</span>
        )}
      </nav>
    </div>
  )
}
