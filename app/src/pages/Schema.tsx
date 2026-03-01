import { For } from 'solid-js'
import { useI18n } from '../contexts/I18nContext'
import rdCategories from '../../../schema/rd-categories.json'
import styles from './Schema.module.css'

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
    <div class={styles.page}>
      <h2 class={styles.title}>{t('schema.title')}</h2>
      <p class={styles.desc}>{t('schema.desc')}</p>

      <div class={styles.coreConcept}>
        <h3>{t('schema.coreConcept')}</h3>
        <p class={styles.conceptLabel}>
          {rdCategories.core_concept?.label_ja || '多次元複雑系'}
        </p>
        <p class={styles.conceptDesc}>
          {rdCategories.core_concept?.description || ''}
        </p>
      </div>

      <div class={styles.fileList}>
        <h3>{t('schema.fileStructure')}</h3>
        <For each={Object.entries(categories())}>
          {([, cat]) => (
            <div class={styles.fileItem}>
              <code class={styles.fileName}>{cat.file}</code>
              <span class={styles.fileDesc}>{cat.description}</span>
            </div>
          )}
        </For>
        <For each={extra()}>
          {(item) => (
            <div class={styles.fileItem}>
              <code class={styles.fileName}>{item.file}</code>
              <span class={styles.fileDesc}>{item.description}</span>
            </div>
          )}
        </For>
      </div>

      <div class={styles.principles}>
        <h3>{t('schema.principles')}</h3>
        <ul>
          <For each={rdCategories.principles as string[]}>
            {(p) => <li>{p}</li>}
          </For>
        </ul>
      </div>
    </div>
  )
}
