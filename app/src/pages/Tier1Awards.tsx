import { useState } from 'react'
import tier1Data from '../../../data/tier1-awards-laureates.json'
import { extractFormulaParts, LatexFormula } from '../components/Latex'
import styles from './Tier1Awards.module.css'

type Tier1AwardId = keyof typeof tier1Data.awards

const awardLabels: Record<string, string> = {
  breakthrough: 'ブレイクスルー賞',
  abel: 'アーベル賞',
  fields: 'フィールズ賞',
  turing: 'チューリング賞',
  lasker: 'ラスカー賞',
  copley: 'コプリ・メダル',
}

type Entry = {
  year: number
  laureates: string[]
  discovery: string
  representative_equation?: string | null
  representative_formula?: string | null
  formula_latex?: string | null
}

export function Tier1Awards() {
  const [awardId, setAwardId] = useState<string>('abel')
  const [yearFilter, setYearFilter] = useState('')

  const award = tier1Data.awards[awardId as Tier1AwardId]
  const entries: Entry[] =
    award && 'entries' in award
      ? (award as { entries: Entry[] }).entries.map((e) => ({
          ...e,
          representative_formula: e.representative_formula ?? e.representative_equation,
        }))
      : []

  const filtered = yearFilter
    ? entries.filter((e) => e.year.toString().includes(yearFilter))
    : entries.slice().reverse().slice(0, 50)

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Tier1 賞 受賞者一覧</h2>
      <p className={styles.desc}>
        研究賞Tier1（ノーベル賞以外）の受賞者履歴と代表的な公式。ブレイクスルー、アーベル、フィールズ、チューリング、ラスカー、コプリ。
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

        <input
          type="text"
          placeholder="年で絞り込み"
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
              <th>主な発見・貢献</th>
              <th>定理・式名</th>
              <th>数式</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((entry) => {
              const formula = entry.representative_formula || entry.representative_equation
              const { text, latex } = extractFormulaParts(formula, entry.formula_latex)
              return (
                <tr key={`${awardId}-${entry.year}`}>
                  <td className={styles.year}>{entry.year}</td>
                  <td>{entry.laureates.join(', ')}</td>
                  <td className={styles.discovery}>{entry.discovery}</td>
                  <td className={styles.theorem}>{text}</td>
                  <td className={styles.formula}>
                    {latex ? (
                      <LatexFormula latex={latex} className={styles.formulaDisplay} />
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
