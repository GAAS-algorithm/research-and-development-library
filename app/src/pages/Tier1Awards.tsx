import { createSignal, For } from 'solid-js'
import { useI18n } from '../contexts/I18nContext'
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
  const { t } = useI18n()
  const [awardId, setAwardId] = createSignal<string>('abel')
  const [yearFilter, setYearFilter] = createSignal('')

  const award = () => tier1Data.awards[awardId() as Tier1AwardId]
  const entries = (): Entry[] => {
    const a = award()
    return a && 'entries' in a
      ? (a as { entries: Entry[] }).entries.map((e) => ({
          ...e,
          representative_formula: e.representative_formula ?? e.representative_equation,
        }))
      : []
  }

  const filtered = () => {
    const filter = yearFilter()
    return filter
      ? entries().filter((e) => e.year.toString().includes(filter))
      : entries().slice().reverse().slice(0, 50)
  }

  const awardIds = () => Object.keys(tier1Data.awards) as string[]

  return (
    <div class={styles.page}>
      <h2 class={styles.title}>{t('tier1.title')}</h2>
      <p class={styles.desc}>{t('tier1.desc')}</p>

      <div class={styles.controls}>
        <select
          value={awardId()}
          onChange={(e) => setAwardId(e.currentTarget.value)}
          class={styles.select}
        >
          <For each={awardIds()}>
            {(id) => (
              <option value={id}>{t(`tier1Award.${id}`)}</option>
            )}
          </For>
        </select>
        <input
          type="text"
          placeholder={t('tier1.filterYear')}
          value={yearFilter()}
          onInput={(e) => setYearFilter(e.currentTarget.value)}
          class={styles.input}
        />
      </div>

      <div class={styles.tableWrap}>
        <table class={styles.table}>
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
            <For each={filtered()}>
              {(entry) => {
                const formula = entry.representative_formula || entry.representative_equation
                const { text, latex } = extractFormulaParts(formula, entry.formula_latex)
                return (
                  <tr>
                    <td class={styles.year}>{entry.year}</td>
                    <td>{entry.laureates.join(', ')}</td>
                    <td class={styles.discovery}>{entry.discovery}</td>
                    <td class={styles.theorem}>{text}</td>
                    <td class={styles.formula}>
                      {latex ? (
                        <span class={styles.formulaDisplay}>
                          <LatexFormula latex={latex} />
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                )
              }}
            </For>
          </tbody>
        </table>
      </div>
    </div>
  )
}
