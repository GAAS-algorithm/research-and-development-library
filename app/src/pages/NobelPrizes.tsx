import { useState } from 'react'
import nobelData from '../../../data/nobel-prizes.json'
import styles from './NobelPrizes.module.css'

type Category = keyof typeof nobelData.categories

const categoryLabels: Record<Category, string> = {
  physics: '物理学',
  chemistry: '化学',
  physiology_or_medicine: '生理学・医学',
  literature: '文学',
  peace: '平和',
  economic_sciences: '経済学',
}

export function NobelPrizes() {
  const [category, setCategory] = useState<Category>('physics')
  const [yearFilter, setYearFilter] = useState('')

  const entries = nobelData.categories[category] as Array<{
    year: number
    laureates: string[]
    discovery: string
    representative_equation: string | null
  }>

  const filtered = yearFilter
    ? entries.filter((e) => e.year.toString().includes(yearFilter))
    : entries.slice(0, 30)

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>ノーベル賞</h2>
      <p className={styles.desc}>1901年創設。主な発見・代表的な方程式を記載。</p>

      <div className={styles.controls}>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          className={styles.select}
        >
          {(Object.keys(categoryLabels) as Category[]).map((cat) => (
            <option key={cat} value={cat}>
              {categoryLabels[cat]}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="年で絞り込み (例: 2020)"
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className={styles.input}
        />
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>年</th>
              <th>受賞者</th>
              <th>主な発見</th>
              <th>代表的な式</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((entry) => (
              <tr key={`${category}-${entry.year}`}>
                <td className={styles.year}>{entry.year}</td>
                <td>{entry.laureates.join(', ')}</td>
                <td className={styles.discovery}>{entry.discovery}</td>
                <td className={styles.equation}>
                  {entry.representative_equation || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
