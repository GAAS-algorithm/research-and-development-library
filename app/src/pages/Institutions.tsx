import institutionsData from '../../../schema/institutions-index.json'
import styles from './Institutions.module.css'

export function Institutions() {
  const categories = institutionsData.categories as Record<
    string,
    { label_ja: string; institutions: Array<{ id: string; name: string; country: string }> }
  >
  const sources = (institutionsData.sources ?? []) as string[]
  const description = (institutionsData.description ?? '') as string

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>機関一覧</h2>
      <p className={styles.desc}>{description}</p>

      <div className={styles.screening}>
        <h3 className={styles.screeningTitle}>スクリーニングロジック</h3>
        <ul className={styles.screeningList}>
          <li><strong>選定基準：</strong>予算規模・著名度の高い研究機関。抜け漏れチェック済み。</li>
          <li><strong>参照ソース：</strong>{sources.join('、')}</li>
          <li><strong>分類：</strong>トップ大学、国立研究機関・アカデミー、企業R&D、純粋数学</li>
        </ul>
      </div>

      {Object.entries(categories).map(([key, cat]) => (
        <div key={key} className={styles.section}>
          <h3 className={styles.sectionTitle}>{cat.label_ja}</h3>
          <div className={styles.grid}>
            {cat.institutions.map((inst) => (
              <div key={inst.id} className={styles.card}>
                <span className={styles.name}>{inst.name}</span>
                <span className={styles.country}>{inst.country}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
