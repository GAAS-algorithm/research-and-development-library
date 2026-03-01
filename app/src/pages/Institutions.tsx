import { For } from 'solid-js'
import { useI18n } from '../contexts/I18nContext'
import institutionsData from '../../../schema/institutions-index.json'

type InstitutionsData = {
  description?: string
  description_en?: string
  description_vi?: string
  sources?: string[]
  categories?: Record<string, { label_ja: string; institutions: Array<{ id: string; name: string; country: string }> }>
}

export function Institutions() {
  const { t, locale } = useI18n()
  const data = institutionsData as InstitutionsData

  const categories = () => data.categories ?? {}
  const sources = () => (data.sources ?? []) as string[]
  const desc = () => {
    const loc = locale()
    if (loc === 'en' && data.description_en) return data.description_en
    if (loc === 'vi' && data.description_vi) return data.description_vi
    return data.description ?? t('institutions.desc')
  }

  return (
    <div class="max-w-[1200px]">
      <h2 class="text-2xl font-semibold mb-2">{t('institutions.title')}</h2>
      <p class="text-[0.9375rem] text-[var(--text-secondary)] mb-6">{desc()}</p>

      <div class="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg py-5 px-6 mb-8">
        <h3 class="text-base font-semibold mb-3">{t('institutions.screening')}</h3>
        <ul class="list-none m-0 p-0">
          <li class="text-sm text-[var(--text-secondary)] leading-relaxed mb-2 last:mb-0"><strong>{t('institutions.criteria')}</strong>{t('institutions.criteriaDesc')}</li>
          <li class="text-sm text-[var(--text-secondary)] leading-relaxed mb-2 last:mb-0"><strong>{t('institutions.sources')}</strong>{sources().join(', ')}</li>
          <li class="text-sm text-[var(--text-secondary)] leading-relaxed mb-2 last:mb-0"><strong>{t('institutions.classification')}</strong>{t('institutions.classificationDesc')}</li>
        </ul>
      </div>

      <For each={Object.entries(categories())}>
        {([key, cat]) => (
          <div class="mb-8">
            <h3 class="text-lg font-semibold mb-4">{t(`institutionsCategory.${key}`) || cat.label_ja}</h3>
            <div class="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3">
              <For each={cat.institutions}>
                {(inst) => (
                  <div class="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[6px] py-3 px-4 flex justify-between items-center">
                    <span class="text-[0.9375rem] font-medium">{inst.name}</span>
                    <span class="text-xs text-[var(--text-muted)]">{inst.country}</span>
                  </div>
                )}
              </For>
            </div>
          </div>
        )}
      </For>
    </div>
  )
}
