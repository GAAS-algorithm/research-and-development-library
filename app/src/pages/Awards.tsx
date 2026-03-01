import awardsData from '../../../schema/research-awards.json'
import styles from './Awards.module.css'

const tierLabels: Record<string, string> = {
  tier1: 'Tier 1（最高峰）',
  tier2: 'Tier 2',
  tier3: 'Tier 3',
}

export function Awards() {
  const awards = awardsData.awards as Array<{
    id: string
    label_en: string
    label_ja: string
    prize_money_usd: number
    frequency: string
    since: number
    impact: string
    note: string
  }>

  const byTier = awardsData.by_impact_tier as Record<string, string[]>

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>研究賞</h2>
      <p className={styles.desc}>
        Breakthrough, Nobel, Abel, Fields, Lasker 等。規模・インパクト順。
      </p>

      <div className={styles.tierSection}>
        <h3 className={styles.sectionTitle}>インパクト別</h3>
        {(Object.entries(byTier) as [string, string[]][]).map(([tier, ids]) => (
          <div key={tier} className={styles.tierBlock}>
            <h4 className={styles.tierTitle}>{tierLabels[tier] || tier}</h4>
            <div className={styles.cardGrid}>
              {ids.map((id) => {
                const award = awards.find((a) => a.id === id)
                if (!award) return null
                return (
                  <div key={id} className={styles.card}>
                    <div className={styles.cardHeader}>
                      <span className={styles.cardName}>{award.label_ja}</span>
                      <span className={styles.cardMoney}>
                        ${(award.prize_money_usd / 1000).toFixed(0)}K
                        {award.prize_money_usd >= 1000000 && '〜'}
                      </span>
                    </div>
                    <p className={styles.cardNote}>{award.note}</p>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.tableSection}>
        <h3 className={styles.sectionTitle}>全賞一覧</h3>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>賞</th>
                <th>賞金額</th>
                <th>頻度</th>
                <th>創設</th>
                <th>備考</th>
              </tr>
            </thead>
            <tbody>
              {awards.map((a) => (
                <tr key={a.id}>
                  <td>
                    <strong>{a.label_ja}</strong>
                    <span className={styles.en}> ({a.label_en})</span>
                  </td>
                  <td>
                    {a.prize_money_usd > 0
                      ? `$${(a.prize_money_usd / 1000).toFixed(0)}K`
                      : '—'}
                  </td>
                  <td>{a.frequency}</td>
                  <td>{a.since}</td>
                  <td className={styles.note}>{a.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
