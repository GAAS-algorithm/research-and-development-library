import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import awardsData from '../../../schema/research-awards.json'
import styles from './Awards.module.css'

type SortKey = 'label_en' | 'prize_money_usd' | 'cumulative_total_usd' | 'since' | null
type SortDir = 'asc' | 'desc'

export function Awards() {
  const { t, i18n } = useTranslation()
  const [sortKey, setSortKey] = useState<SortKey>(null)
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const tierLabels: Record<string, string> = {
    tier1: t('awards.tier1'),
    tier2: t('awards.tier2'),
    tier3: t('awards.tier3'),
  }

  const awards = awardsData.awards as Array<{
    id: string
    label_en: string
    label_ja: string
    prize_money_usd: number
    cumulative_total_usd?: number
    frequency: string
    since: number
    impact: string
    note: string
  }>

  const byTier = awardsData.by_impact_tier as Record<string, string[]>

  const sortedAwards = useMemo(() => {
    if (!sortKey) return [...awards]
    return [...awards].sort((a, b) => {
      if (sortKey === 'label_en') {
        const cmp = a.label_en.localeCompare(b.label_en, 'en')
        return sortDir === 'asc' ? cmp : -cmp
      }
      const aVal = sortKey === 'since' ? a.since : (a[sortKey] ?? (sortKey === 'cumulative_total_usd' ? -1 : 0))
      const bVal = sortKey === 'since' ? b.since : (b[sortKey] ?? (sortKey === 'cumulative_total_usd' ? -1 : 0))
      const diff = (aVal as number) - (bVal as number)
      return sortDir === 'asc' ? diff : -diff
    })
  }, [awards, sortKey, sortDir])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir(key === 'since' || key === 'label_en' ? 'asc' : 'desc')
    }
  }

  const awardLabel = (a: { label_en: string; label_ja: string }) =>
    i18n.language === 'ja' ? a.label_ja : a.label_en
  const awardSub = (a: { label_en: string; label_ja: string }) =>
    i18n.language === 'ja' ? a.label_en : a.label_ja

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>{t('awards.title')}</h2>
      <p className={styles.desc}>{t('awards.desc')}</p>

      <div className={styles.tierSection}>
        <h3 className={styles.sectionTitle}>{t('awards.byImpact')}</h3>
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
                      <span className={styles.cardName}>{awardLabel(award)}</span>
                      <span className={styles.cardMoney}>
                        ${(award.prize_money_usd / 1000).toFixed(0)}K
                        {award.prize_money_usd >= 1000000 && '〜'}
                        {award.cumulative_total_usd != null && (
                          <span className={styles.cumulative}>
                            {' '}{t('awards.cumulative')} ${(award.cumulative_total_usd / 1000000).toFixed(0)}M
                          </span>
                        )}
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
        <h3 className={styles.sectionTitle}>{t('awards.allList')}</h3>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.sortable} onClick={() => handleSort('label_en')}>
                  {t('awards.award')} {sortKey === 'label_en' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th className={styles.sortable} onClick={() => handleSort('prize_money_usd')}>
                  {t('awards.prizeMoney')} {sortKey === 'prize_money_usd' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th className={styles.sortable} onClick={() => handleSort('cumulative_total_usd')}>
                  {t('awards.cumulative')} {sortKey === 'cumulative_total_usd' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th className={styles.sortable} onClick={() => handleSort('since')}>
                  {t('awards.since')} {sortKey === 'since' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th>{t('awards.frequency')}</th>
                <th>{t('awards.note')}</th>
              </tr>
            </thead>
            <tbody>
              {sortedAwards.map((a) => (
                <tr key={a.id}>
                  <td>
                    <strong>{awardLabel(a)}</strong>
                    <span className={styles.ja}> ({awardSub(a)})</span>
                  </td>
                  <td>
                    {a.prize_money_usd > 0 ? `$${(a.prize_money_usd / 1000).toFixed(0)}K` : '—'}
                  </td>
                  <td>
                    {a.cumulative_total_usd != null ? `$${(a.cumulative_total_usd / 1000000).toFixed(0)}M` : '—'}
                  </td>
                  <td>{a.since}</td>
                  <td>{a.frequency}</td>
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
