import { createSignal, For } from 'solid-js'
import { useI18n } from '../contexts/I18nContext'
import nobelData from '../../../data/nobel-prizes.json'
import { extractFormulaParts, LatexFormula } from '../components/Latex'

type Category = keyof typeof nobelData.categories

type NobelEntry = {
  year: number
  laureates: string[]
  discovery: string
  representative_equation: string | null
  formula_latex?: string | null
}

export function NobelPrizes() {
  const { t } = useI18n()
  const [category, setCategory] = createSignal<Category>('physics')
  const [yearFilter, setYearFilter] = createSignal('')

  const entries = () => nobelData.categories[category()] as NobelEntry[]

  const filtered = () => {
    const filter = yearFilter()
    return filter
      ? entries().filter((e) => e.year.toString().includes(filter))
      : entries()
  }

  const categories = () => Object.keys(nobelData.categories) as Category[]

  return (
    <div class="max-w-[1200px]">
      <h2 class="text-2xl font-semibold mb-2">{t('nobel.title')}</h2>
      <p class="text-[0.9375rem] text-[var(--text-secondary)] mb-6">{t('nobel.desc')}</p>

      <div class="flex gap-4 mb-6">
        <select
          value={category()}
          onChange={(e) => setCategory(e.currentTarget.value as Category)}
          class="py-2.5 px-3.5 border border-[var(--border)] rounded-[6px] text-[0.9375rem] bg-[var(--bg-secondary)]"
        >
          <For each={categories()}>
            {(cat) => (
              <option value={cat}>{t(`nobelCategory.${cat}`)}</option>
            )}
          </For>
        </select>
        <input
          type="text"
          placeholder={t('nobel.filterYear')}
          value={yearFilter()}
          onInput={(e) => setYearFilter(e.currentTarget.value)}
          class="py-2.5 px-3.5 border border-[var(--border)] rounded-[6px] text-[0.9375rem] bg-[var(--bg-secondary)] w-[200px]"
        />
      </div>

      <div class="overflow-x-auto bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg shadow-[var(--shadow)]">
        <table class="w-full border-collapse">
          <thead>
            <tr>
              <th class="py-3 px-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">{t('nobel.year')}</th>
              <th class="py-3 px-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">{t('nobel.laureates')}</th>
              <th class="py-3 px-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">{t('nobel.discovery')}</th>
              <th class="py-3 px-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">{t('nobel.theorem')}</th>
              <th class="py-3 px-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">{t('nobel.formula')}</th>
            </tr>
          </thead>
          <tbody>
            <For each={filtered()}>
              {(entry) => {
                const { text, latex } = extractFormulaParts(
                  entry.representative_equation,
                  entry.formula_latex
                )
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
