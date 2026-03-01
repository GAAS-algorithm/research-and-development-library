import { For } from 'solid-js'
import { useI18n } from '../contexts/I18nContext'
import rdCategories from '../../../schema/rd-categories.json'
import styles from './Schema.module.css'

type FileDesc = { file: string; description: string; description_en?: string }

export function Schema() {
  const { t, locale } = useI18n()

  const categories = () => rdCategories.categories as Record<string, FileDesc>
  const extra = () => [
    rdCategories.nobel_prizes,
    rdCategories.research_awards,
    rdCategories.major_awards_detail,
    rdCategories.institutions_index,
  ].filter(Boolean) as FileDesc[]

  const coreConcept = () => rdCategories.core_concept as { label_en?: string; label_ja?: string; description?: string; description_en?: string } | undefined
  const isJa = () => locale() === 'ja'
  const conceptLabel = () => (isJa() ? coreConcept()?.label_ja : coreConcept()?.label_en) || (isJa() ? '多次元複雑系' : 'Multidimensional Complex System')
  const conceptDesc = () => (isJa() ? coreConcept()?.description : coreConcept()?.description_en) || ''

  return (
    <div class={styles.page}>
      <h2 class={styles.title}>{t('schema.title')}</h2>
      <p class={styles.desc}>{t('schema.desc')}</p>

      <div class={styles.coreConcept}>
        <h3>{t('schema.coreConcept')}</h3>
        <p class={styles.conceptLabel}>
          {conceptLabel()}
        </p>
        <p class={styles.conceptDesc}>
          {conceptDesc()}
        </p>
      </div>

      <div class={styles.fileList}>
        <h3>{t('schema.fileStructure')}</h3>
        <For each={Object.entries(categories())}>
          {([, cat]) => (
            <div class={styles.fileItem}>
              <code class={styles.fileName}>{cat.file}</code>
              <span class={styles.fileDesc}>{isJa() ? cat.description : (cat.description_en ?? cat.description)}</span>
            </div>
          )}
        </For>
        <For each={extra()}>
          {(item) => (
            <div class={styles.fileItem}>
              <code class={styles.fileName}>{item.file}</code>
              <span class={styles.fileDesc}>{isJa() ? item.description : (item.description_en ?? item.description)}</span>
            </div>
          )}
        </For>
      </div>

      <div class={styles.principles}>
        <h3>{t('schema.principles')}</h3>
        <ul>
          <li>{t('schema.principle1')}</li>
          <li>{t('schema.principle2')}</li>
          <li>{t('schema.principle3')}</li>
        </ul>
      </div>
    </div>
  )
}
