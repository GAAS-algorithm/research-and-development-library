import { For } from 'solid-js'
import { useI18n } from '../contexts/I18nContext'
import institutionsData from '../../../schema/institutions-index.json'
import styles from './Institutions.module.css'

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
    <div class={styles.page}>
      <h2 class={styles.title}>{t('institutions.title')}</h2>
      <p class={styles.desc}>{desc()}</p>

      <div class={styles.screening}>
        <h3 class={styles.screeningTitle}>{t('institutions.screening')}</h3>
        <ul class={styles.screeningList}>
          <li><strong>{t('institutions.criteria')}</strong>{t('institutions.criteriaDesc')}</li>
          <li><strong>{t('institutions.sources')}</strong>{sources().join(', ')}</li>
          <li><strong>{t('institutions.classification')}</strong>{t('institutions.classificationDesc')}</li>
        </ul>
      </div>

      <For each={Object.entries(categories())}>
        {([key, cat]) => (
          <div class={styles.section}>
            <h3 class={styles.sectionTitle}>{t(`institutionsCategory.${key}`) || cat.label_ja}</h3>
            <div class={styles.grid}>
              <For each={cat.institutions}>
                {(inst) => (
                  <div class={styles.card}>
                    <span class={styles.name}>{inst.name}</span>
                    <span class={styles.country}>{inst.country}</span>
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
