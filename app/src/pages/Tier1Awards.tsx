import { createSignal, For, createEffect } from 'solid-js'
import { useParams, useNavigate } from '@solidjs/router'
import { useI18n } from '../contexts/I18nContext'
import { useLang, pathWithLang } from '../hooks/useLang'
import tier1Data from '../../../data/tier1-awards-laureates.json'
import { extractFormulaParts, LatexFormula } from '../components/Latex'
import styles from './Tier1Awards.module.css'

type Tier1AwardId = keyof typeof tier1Data.awards

const VALID_AWARD_IDS = Object.keys(tier1Data.awards) as Tier1AwardId[]

function isValidAwardId(id: string | undefined): id is Tier1AwardId {
  return !!id && VALID_AWARD_IDS.includes(id as Tier1AwardId)
}

type Entry = {
  year: number
  laureates: string[]
  discovery: string
  discovery_en?: string
  representative_equation?: string | null
  representative_formula?: string | null
  representative_formula_en?: string | null
  formula_latex?: string | null
}

export function Tier1Awards() {
  const { t, locale } = useI18n()
  const params = useParams<{ lang: string; awardId?: string }>()
  const navigate = useNavigate()
  const lang = useLang()
  const isJa = () => locale() === 'ja'

  const awardId = () => {
    const id = params.awardId
    return isValidAwardId(id) ? id : 'abel'
  }

  const [yearFilter, setYearFilter] = createSignal('')

  createEffect(() => {
    const id = params.awardId
    if (!id) {
      navigate(pathWithLang('/tier1-awards/abel', lang()), { replace: true })
    } else if (!isValidAwardId(id)) {
      navigate(pathWithLang('/tier1-awards/abel', lang()), { replace: true })
    }
  })

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

  const awardIds = () => [...VALID_AWARD_IDS].sort()

  const handleAwardChange = (e: Event) => {
    const id = (e.currentTarget as HTMLSelectElement).value as Tier1AwardId
    navigate(pathWithLang(`/tier1-awards/${id}`, lang()))
  }

  return (
    <div class={styles.page}>
      <h2 class={styles.title}>{t('tier1.title')}</h2>
      <p class={styles.desc}>{t('tier1.desc')}</p>

      <div class={styles.controls}>
        <select
          value={awardId()}
          onChange={handleAwardChange}
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
                const formulaRaw = isJa()
                  ? (entry.representative_formula ?? entry.representative_equation)
                  : (entry.representative_formula_en ?? entry.representative_formula ?? entry.representative_equation)
                const { text, latex } = extractFormulaParts(formulaRaw, entry.formula_latex)
                const discoveryText = isJa() ? entry.discovery : (entry.discovery_en ?? entry.discovery)
                return (
                  <tr>
                    <td class={styles.year}>{entry.year}</td>
                    <td>{entry.laureates.join(', ')}</td>
                    <td class={styles.discovery}>{discoveryText}</td>
                    <td class={styles.theorem}>{text}</td>
                    <td class={styles.formula}>
                      {latex ? (
                        <LatexFormula latex={latex} class={styles.formulaDisplay} />
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
