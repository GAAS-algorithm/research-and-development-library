import { createSignal, For } from 'solid-js'
import { useI18n } from '../contexts/I18nContext'
import tier1Data from '../../../data/tier1-awards-laureates.json'
import { extractFormulaParts, LatexFormula } from '../components/Latex'

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
    <div class="max-w-[1200px]">
      <h2 class="text-2xl font-semibold mb-2">{t('tier1.title')}</h2>
      <p class="text-[0.9375rem] text-[var(--text-secondary)] mb-6">{t('tier1.desc')}</p>

      <div class="flex gap-4 mb-6 flex-wrap">
        <select
          value={awardId()}
          onChange={(e) => setAwardId(e.currentTarget.value)}
          class="py-2.5 px-3.5 border border-[var(--border)] rounded-[6px] text-[0.9375rem] bg-[var(--bg-secondary)]"
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
          class="py-2.5 px-3.5 border border-[var(--border)] rounded-[6px] text-[0.9375rem] bg-[var(--bg-secondary)] w-[200px]"
        />
      </div>

      <div class="overflow-x-auto bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg shadow-[var(--shadow)]">
        <table class="w-full border-collapse">
          <thead>
            <tr>
              <th class="py-3 px-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">{t('tier1.year')}</th>
              <th class="py-3 px-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">{t('tier1.laureates')}</th>
              <th class="py-3 px-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">{t('tier1.discovery')}</th>
              <th class="py-3 px-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">{t('tier1.theorem')}</th>
              <th class="py-3 px-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">{t('tier1.formula')}</th>
            </tr>
          </thead>
          <tbody>
            <For each={filtered()}>
              {(entry) => {
                const formula = entry.representative_formula || entry.representative_equation
                const { text, latex } = extractFormulaParts(formula, entry.formula_latex)
                return (
                  <tr>
                    <td class="py-3 px-4 text-left border-b border-[var(--border-light)] text-sm font-semibold text-[var(--accent)] w-[60px]">{entry.year}</td>
                    <td class="py-3 px-4 text-left border-b border-[var(--border-light)] text-sm">{entry.laureates.join(', ')}</td>
                    <td class="py-3 px-4 text-left border-b border-[var(--border-light)] text-sm text-[var(--text-secondary)] max-w-[400px]">{entry.discovery}</td>
                    <td class="py-3 px-4 text-left border-b border-[var(--border-light)] text-sm text-[var(--text-secondary)] max-w-[200px]">{text}</td>
                    <td class="py-3 px-4 text-left border-b border-[var(--border-light)] text-sm text-[var(--text-primary)] min-w-[120px] overflow-x-auto">
                      {latex ? (
                        <LatexFormula latex={latex} class="overflow-x-auto [&_.katex]:text-[1em]" />
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
