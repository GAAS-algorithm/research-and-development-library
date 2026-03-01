import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import tier1Data from '../../../data/tier1-awards-laureates.json'
import { extractFormulaParts, LatexFormula } from '../components/Latex'
import styles from './Tier1Awards.module.css'

type Tier1AwardId = keyof typeof tier1Data.awards

type Entry = {
  year: number
  laureates: string[]
  discovery: string
  representative_equation?: string | null
  representative_formula?: string | null
  formula_latex?: string | null
}

export function Tier1Awards() {
  const { t } = useTranslation()
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

  const awardIds = Object.keys(tier1Data.awards) as string[]

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>{t('tier1.title')}</h2>
      <p className={styles.desc}>{t('tier1.desc')}</p>

      <div className={styles.controls}>
        <select
          value={awardId}
          onChange={(e) => setAwardId(e.target.value)}
          className={styles.select}
        >
          {awardIds.map((id) => (
            <option key={id} value={id}>
              {t(`tier1Award.${id}`)}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder={t('tier1.filterYear')}
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className={styles.input}
        />
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t('tier1.year')}</th>
              <th>{t('tier1.laureates')}</th>
              <th>{t('tier1.discovery')}</th>
              <th>{t('tier1.theorem')}</th>
              <th>{t('tier1.formula')}</th>
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
