import { For, Show } from 'solid-js'
import { A } from '@solidjs/router'
import { useI18n } from '../contexts/I18nContext'
import { useLang, pathWithLang } from '../hooks/useLang'
import frontierData from '../../../schema/frontier-topics.json'
import styles from './FrontierTopics.module.css'

export function FrontierTopics() {
  const { t, locale } = useI18n()
  const lang = useLang()

  const topics = () => frontierData.topics as Array<{
    id: string
    label_ja: string
    label_en: string
    label_vi?: string
    description: string
    description_en?: string
    description_vi?: string
    top_institutions: string[]
    also_notable?: string[]
  }>

  const topicLabel = (topic: { label_ja: string; label_en: string; label_vi?: string }) => {
    const loc = locale()
    if (loc === 'ja') return topic.label_ja
    if (loc === 'vi' && topic.label_vi) return topic.label_vi
    return topic.label_en
  }
  const topicDesc = (topic: { description: string; description_en?: string; description_vi?: string }) => {
    const loc = locale()
    if (loc === 'en' && topic.description_en) return topic.description_en
    if (loc === 'vi' && topic.description_vi) return topic.description_vi
    return topic.description
  }

  return (
    <div class={styles.page}>
      <h2 class={styles.title}>{t('frontier.title')}</h2>
      <p class={styles.desc}>{t('frontier.desc')}</p>

      <div class={styles.index}>
        <h3 class={styles.indexTitle}>{t('frontier.indexTitle')}</h3>
        <div class={styles.indexList}>
          <For each={topics()}>
            {(topic) => (
              <A href={pathWithLang(`/frontier-topics/${topic.id}`, lang())} class={styles.indexItem}>
                {topicLabel(topic)}
              </A>
            )}
          </For>
        </div>
      </div>

      <div class={styles.grid}>
        <For each={topics()}>
          {(topic) => (
            <A href={pathWithLang(`/frontier-topics/${topic.id}`, lang())} class={styles.card}>
              <div class={styles.cardHeader}>
                <h3 class={styles.cardTitle}>{topicLabel(topic)}</h3>
                <span class={styles.cardId}>{topic.id}</span>
              </div>
              <p class={styles.descText}>{topicDesc(topic)}</p>
              <div class={styles.institutions}>
                <span class={styles.label}>{t('frontier.top3')}</span>
                {topic.top_institutions.join(', ')}
              </div>
              <Show when={topic.also_notable && topic.also_notable.length > 0}>
                <div class={styles.alsoNotable}>
                  <span class={styles.label}>{t('frontier.also')}</span>
                  {topic.also_notable!.join(', ')}
                </div>
              </Show>
            </A>
          )}
        </For>
      </div>
    </div>
  )
}
