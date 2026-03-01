import { useState } from 'react'
import { Link } from 'react-router-dom'
import nobelData from '../../../data/nobel-prizes.json'
import tier1Data from '../../../data/tier1-awards-laureates.json'
import styles from './Tier1Awards.module.css'

type NobelCategory = keyof typeof nobelData.categories
type Tier1AwardId = keyof typeof tier1Data.awards

const awardLabels: Record<string, string> = {
  nobel: 'ノーベル賞',
  breakthrough: 'ブレイクスルー賞',
  abel: 'アーベル賞',
  fields: 'フィールズ賞',
  turing: 'チューリング賞',
  lasker: 'ラスカー賞',
  copley: 'コプリ・メダル',
}

const nobelCategoryLabels: Record<NobelCategory, string> = {
  physics: '物理学',
  chemistry: '化学',
  physiology_or_medicine: '生理学・医学',
  literature: '文学',
  peace: '平和',
  economic_sciences: '経済学',
}

type Entry = {
  year: number
  laureates: string[]
  discovery: string
  representative_equation?: string | null
  representative_formula?: string | null
}

export function Tier1Awards() {
  const [awardId, setAwardId] = useState<string>('abel')
  const [nobelCategory, setNobelCategory] = useState<NobelCategory>('physics')
  const [yearFilter, setYearFilter] = useState('')

  const isNobel = awardId === 'nobel'

  let entries: Entry[] = []
  if (isNobel) {
    const catEntries = nobelData.categories[nobelCategory] as Entry[]
    entries = catEntries.map((e) => ({
      ...e,
      representative_formula: e.representative_equation,
    }))
  } else {
    const award = tier1Data.awards[awardId as Tier1AwardId]
    if (award && 'entries' in award) {
      entries = (award as { entries: Entry[] }).entries.map((e) => ({
        ...e,
        representative_formula: e.representative_formula ?? e.representative_equation,
      }))
    }
  }

  const filtered = yearFilter
    ? entries.filter((e) => e.year.toString().includes(yearFilter))
    : entries.slice().reverse().slice(0, 50)

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Tier1 賞 受賞者一覧</h2>
      <p className={styles.desc}>
        研究賞Tier1（ノーベル、ブレイクスルー、アーベル、フィールズ、チューリング、ラスカー、コプリ）の受賞者履歴と代表的な公式。
      </p>

      <div className={styles.controls}>
        <select
          value={awardId}
          onChange={(e) => setAwardId(e.target.value)}
          className={styles.select}
        >
          {(Object.keys(awardLabels) as string[]).map((id) => (
            <option key={id} value={id}>
              {awardLabels[id]}
            </option>
          ))}
        </select>

        {isNobel && (
          <select
            value={nobelCategory}
            onChange={(e) => setNobelCategory(e.target.value as NobelCategory)}
            className={styles.select}
          >
            {(Object.keys(nobelCategoryLabels) as NobelCategory[]).map((cat) => (
              <option key={cat} value={cat}>
                {nobelCategoryLabels[cat]}
              </option>
            ))}
          </select>
        )}

        <input
          type="text"
          placeholder="年で絞り込み"
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className={styles.input}
        />
      </div>

      {isNobel && (
        <p className={styles.nobelLink}>
          ノーベル賞の全履歴は <Link to="/nobel">ノーベル賞ページ</Link> を参照。
        </p>
      )}

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>年</th>
              <th>受賞者</th>
              <th>主な発見・貢献</th>
              <th>代表的な式・定理</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((entry) => (
              <tr key={`${awardId}-${entry.year}`}>
                <td className={styles.year}>{entry.year}</td>
                <td>{entry.laureates.join(', ')}</td>
                <td className={styles.discovery}>{entry.discovery}</td>
                <td className={styles.formula}>
                  {entry.representative_formula || entry.representative_equation || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
