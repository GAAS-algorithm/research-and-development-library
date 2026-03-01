import { createSignal, For, createEffect } from 'solid-js'
import { useParams, useNavigate } from '@solidjs/router'
import { useI18n } from '../contexts/I18nContext'
import nobelData from '../../../data/nobel-prizes.json'
import { extractFormulaParts, LatexFormula } from '../components/Latex'
import styles from './NobelPrizes.module.css'
import { useLang, pathWithLang } from '../hooks/useLang'

type Category = keyof typeof nobelData.categories

const VALID_CATEGORIES = Object.keys(nobelData.categories) as Category[]

function isValidCategory(cat: string | undefined): cat is Category {
  return !!cat && VALID_CATEGORIES.includes(cat as Category)
}

type NobelEntry = {
  year: number
  laureates: string[]
  discovery: string
  representative_equation: string | null
  formula_latex?: string | null
}

export function NobelPrizes() {
  const { t } = useI18n()
  const params = useParams<{ lang: string; category?: string }>()
  const navigate = useNavigate()
  const lang = useLang()

  const category = () => {
    const cat = params.category
    return isValidCategory(cat) ? cat : 'physics'
  }

  const [yearFilter, setYearFilter] = createSignal('')

  createEffect(() => {
    const cat = params.category
    if (!cat) {
      navigate(pathWithLang('/nobel/physics', lang()), { replace: true })
    } else if (!isValidCategory(cat)) {
      navigate(pathWithLang('/nobel/physics', lang()), { replace: true })
    }
  })

  const entries = () => nobelData.categories[category()] as NobelEntry[]

  const filtered = () => {
    const filter = yearFilter()
    return filter
      ? entries().filter((e) => e.year.toString().includes(filter))
      : entries()
  }

  const categories = () => VALID_CATEGORIES

  const handleCategoryChange = (e: Event) => {
    const cat = (e.currentTarget as HTMLSelectElement).value as Category
    navigate(pathWithLang(`/nobel/${cat}`, lang()))
  }

  return (
    <div class={styles.page}>
      <h2 class={styles.title}>{t('nobel.title')}</h2>
      <p class={styles.desc}>{t('nobel.desc')}</p>

      <div class={styles.controls}>
        <select
          value={category()}
          onChange={handleCategoryChange}
          class={styles.select}
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
          class={styles.input}
        />
      </div>

      <div class={styles.tableWrap}>
        <table class={styles.table}>
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
            <For each={filtered()}>
              {(entry) => {
                const { text, latex } = extractFormulaParts(
                  entry.representative_equation,
                  entry.formula_latex
                )
                return (
                  <tr>
                    <td class={styles.year}>{entry.year}</td>
                    <td>{entry.laureates.join(', ')}</td>
                    <td class={styles.discovery}>{entry.discovery}</td>
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