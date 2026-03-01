import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import nobelData from '../../../data/nobel-prizes.json'
import { extractFormulaParts, LatexFormula } from '../components/Latex'
import styles from './NobelPrizes.module.css'

type Category = keyof typeof nobelData.categories

type NobelEntry = {
  year: number
  laureates: string[]
  discovery: string
  representative_equation: string | null
  formula_latex?: string | null
}

export function NobelPrizes() {
  const { t } = useTranslation()
  const [category, setCategory] = useState<Category>('physics')
  const [yearFilter, setYearFilter] = useState('')

  const entries = nobelData.categories[category] as NobelEntry[]

  const filtered = yearFilter
    ? entries.filter((e) => e.year.toString().includes(yearFilter))
    : entries

  const categories = (Object.keys(nobelData.categories) as Category[])

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>{t('nobel.title')}</h2>
      <p className={styles.desc}>{t('nobel.desc')}</p>

      <div className={styles.controls}>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          className={styles.select}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {t(`nobelCategory.${cat}`)}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder={t('nobel.filterYear')}
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className={styles.input}
        />
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t('nobel.year')}</th>
              <th>{t('nobel.laureates')}</th>
              <th>{t('nobel.discovery')}</th>
              <th>{t('nobel.theorem')}</th>
              <th>{t('nobel.formula')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((entry) => {
              const { text, latex } = extractFormulaParts(
                entry.representative_equation,
                entry.formula_latex
              )
              return (
                <tr key={`${category}-${entry.year}`}>
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
