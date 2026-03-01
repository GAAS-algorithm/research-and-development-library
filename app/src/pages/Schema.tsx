import { For } from 'solid-js'
import { useI18n } from '../contexts/I18nContext'
import rdCategories from '../../../schema/rd-categories.json'

type FileDesc = { file: string; description: string }

export function Schema() {
  const { t } = useI18n()

  const categories = () => rdCategories.categories as Record<string, FileDesc>
  const extra = () => [
    rdCategories.nobel_prizes,
    rdCategories.research_awards,
    rdCategories.major_awards_detail,
    rdCategories.institutions_index,
  ].filter(Boolean) as FileDesc[]

  return (
    <div class="max-w-[900px]">
      <h2 class="text-2xl font-semibold mb-2">{t('schema.title')}</h2>
      <p class="text-[0.9375rem] text-[var(--text-secondary)] mb-8">{t('schema.desc')}</p>

      <div class="mb-8">
        <h3 class="text-lg font-semibold mb-3">{t('schema.coreConcept')}</h3>
        <p class="text-lg font-semibold text-[var(--accent)] mb-1">
          {rdCategories.core_concept?.label_ja || '多次元複雑系'}
        </p>
        <p class="text-[0.9375rem] text-[var(--text-secondary)]">
          {rdCategories.core_concept?.description || ''}
        </p>
      </div>

      <div class="mb-8">
        <h3 class="text-lg font-semibold mb-3">{t('schema.fileStructure')}</h3>
        <For each={Object.entries(categories())}>
          {([, cat]) => (
            <div class="flex items-baseline gap-4 py-2.5 border-b border-[var(--border-light)]">
              <code class="font-mono text-sm text-[var(--text-primary)] min-w-[200px]">{cat.file}</code>
              <span class="text-sm text-[var(--text-secondary)]">{cat.description}</span>
            </div>
          )}
        </For>
        <For each={extra()}>
          {(item) => (
            <div class="flex items-baseline gap-4 py-2.5 border-b border-[var(--border-light)]">
              <code class="font-mono text-sm text-[var(--text-primary)] min-w-[200px]">{item.file}</code>
              <span class="text-sm text-[var(--text-secondary)]">{item.description}</span>
            </div>
          )}
        </For>
      </div>

      <div class="mb-8">
        <h3 class="text-lg font-semibold mb-3">{t('schema.principles')}</h3>
        <ul class="list-none">
          <For each={rdCategories.principles as string[]}>
            {(p) => <li class="py-2 text-[0.9375rem] text-[var(--text-secondary)]">{p}</li>}
          </For>
        </ul>
      </div>
    </div>
  )
}
