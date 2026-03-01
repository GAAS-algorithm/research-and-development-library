import { createSignal, createMemo, For } from 'solid-js'
import { useI18n } from '../contexts/I18nContext'
import awardsData from '../../../schema/research-awards.json'
import styles from './Awards.module.css'

type SortKey = 'label_en' | 'prize_money_usd' | 'cumulative_total_usd' | 'since' | null
type SortDir = 'asc' | 'desc'

export function Awards() {
  const { t, locale } = useI18n()
  const [sortKey, setSortKey] = createSignal<SortKey>(null)
  const [sortDir, setSortDir] = createSignal<SortDir>('desc')

  const tierLabels = () => ({
    tier1: t('awards.tier1'),
    tier2: t('awards.tier2'),
    tier3: t('awards.tier3'),
  })

  const awards = () => awardsData.awards as Array<{
    id: string
    label_en: string
    label_ja: string
    label_vi?: string
    prize_money_usd: number
    cumulative_total_usd?: number
    frequency: string
    since: number
    impact: string
    note: string
    note_en?: string
    note_vi?: string
  }>

  const byTier = () => awardsData.by_impact_tier as Record<string, string[]>

  const sortedAwards = createMemo(() => {
    const list = awards()
    const key = sortKey()
    const dir = sortDir()
    if (!key) return [...list]
    return [...list].sort((a, b) => {
      if (key === 'label_en') {
        const cmp = a.label_en.localeCompare(b.label_en, 'en')
        return dir === 'asc' ? cmp : -cmp
      }
      const aVal = key === 'since' ? a.since : (a[key as keyof typeof a] ?? (key === 'cumulative_total_usd' ? -1 : 0))
      const bVal = key === 'since' ? b.since : (b[key as keyof typeof b] ?? (key === 'cumulative_total_usd' ? -1 : 0))
      const diff = (aVal as number) - (bVal as number)
      return dir === 'asc' ? diff : -diff
    })
  })

  const handleSort = (key: SortKey) => {
    if (sortKey() === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir(key === 'since' || key === 'label_en' ? 'asc' : 'desc')
    }
  }

  const awardLabel = (a: { label_en: string; label_ja: string; label_vi?: string }) => {
    const loc = locale()
    if (loc === 'ja') return a.label_ja
    if (loc === 'vi' && a.label_vi) return a.label_vi
    return a.label_en
  }
  const awardSub = (a: { label_en: string; label_ja: string; label_vi?: string }) => {
    const loc = locale()
    if (loc === 'ja') return a.label_en
    if (loc === 'vi') return a.label_ja
    return a.label_ja
  }
  const awardNote = (a: { note: string; note_en?: string; note_vi?: string }) => {
    const loc = locale()
    if (loc === 'en' && a.note_en) return a.note_en
    if (loc === 'vi' && a.note_vi) return a.note_vi
    return a.note
  }
  const awardFrequency = (freq: string) => {
    const key = freq === 'annual' ? 'freqAnnual' : freq === 'biennial' ? 'freqBiennial' : freq === 'quadrennial' ? 'freqQuadrennial' : null
    return key ? t(`awards.${key}`) : freq
  }

  return (
    <div class={styles.page}>
      <h2 class={styles.title}>{t('awards.title')}</h2>
      <p class={styles.desc}>{t('awards.desc')}</p>

      <div class={styles.tierSection}>
        <h3 class={styles.sectionTitle}>{t('awards.byImpact')}</h3>
        <For each={Object.entries(byTier()) as [string, string[]][]}>
          {([tier, ids]) => (
            <div class={styles.tierBlock}>
              <h4 class={styles.tierTitle}>{(tierLabels() as Record<string, string>)[tier] || tier}</h4>
              <div class={styles.cardGrid}>
                <For each={ids}>
                  {(id) => {
                    const award = awards().find((a) => a.id === id)
                    if (!award) return null
                    return (
                      <div class={styles.card}>
                        <div class={styles.cardHeader}>
                          <span class={styles.cardName}>{awardLabel(award)}</span>
                          <span class={styles.cardMoney}>
                            ${(award.prize_money_usd / 1000).toFixed(0)}K
                            {award.prize_money_usd >= 1000000 && '〜'}
                            {award.cumulative_total_usd != null && (
                              <span class={styles.cumulative}>
                                {' '}{t('awards.cumulative')} ${(award.cumulative_total_usd / 1000000).toFixed(0)}M
                              </span>
                            )}
                          </span>
                        </div>
                        <p class={styles.cardNote}>{awardNote(award)}</p>
                      </div>
                    )
                  }}
                </For>
              </div>
            </div>
          )}
        </For>
      </div>

      <div class={styles.tableSection}>
        <h3 class={styles.sectionTitle}>{t('awards.allList')}</h3>
        <div class={styles.tableWrap}>
          <table class={styles.table}>
            <thead>
              <tr>
                <th class={`${styles.sortable}`} onClick={() => handleSort('label_en')}>
                  {t('awards.award')} {sortKey() === 'label_en' && (sortDir() === 'asc' ? '↑' : '↓')}
                </th>
                <th class={`${styles.sortable}`} onClick={() => handleSort('prize_money_usd')}>
                  {t('awards.prizeMoney')} {sortKey() === 'prize_money_usd' && (sortDir() === 'asc' ? '↑' : '↓')}
                </th>
                <th class={`${styles.sortable}`} onClick={() => handleSort('cumulative_total_usd')}>
                  {t('awards.cumulative')} {sortKey() === 'cumulative_total_usd' && (sortDir() === 'asc' ? '↑' : '↓')}
                </th>
                <th class={`${styles.sortable}`} onClick={() => handleSort('since')}>
                  {t('awards.since')} {sortKey() === 'since' && (sortDir() === 'asc' ? '↑' : '↓')}
                </th>
                <th>{t('awards.frequency')}</th>
                <th>{t('awards.note')}</th>
              </tr>
            </thead>
            <tbody>
              <For each={sortedAwards()}>
                {(a) => (
                  <tr>
                    <td>
                      <strong>{awardLabel(a)}</strong>
                      <span class={styles.ja}> ({awardSub(a)})</span>
                    </td>
                    <td>{a.prize_money_usd > 0 ? `$${(a.prize_money_usd / 1000).toFixed(0)}K` : '—'}</td>
                    <td>{a.cumulative_total_usd != null ? `$${(a.cumulative_total_usd / 1000000).toFixed(0)}M` : '—'}</td>
                    <td>{a.since}</td>
                    <td>{awardFrequency(a.frequency)}</td>
                    <td class={styles.note}>{awardNote(a)}</td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
