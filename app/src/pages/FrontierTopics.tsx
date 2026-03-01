import { For, Show } from 'solid-js'
import { A } from '@solidjs/router'
import { useI18n } from '../contexts/I18nContext'
import { useLang, pathWithLang } from '../hooks/useLang'
import frontierData from '../../../schema/frontier-topics.json'

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
    <div class="max-w-[1200px]">
      <h2 class="text-2xl font-semibold mb-2">{t('frontier.title')}</h2>
      <p class="text-[0.9375rem] text-[var(--text-secondary)] mb-6">{t('frontier.desc')}</p>

      <div class="mb-8">
        <h3 class="text-base font-semibold mb-3">{t('frontier.indexTitle')}</h3>
        <div class="flex flex-wrap gap-2">
          <For each={topics()}>
            {(topic) => (
              <A href={pathWithLang(`/frontier-topics/${topic.id}`, lang())} class="text-sm text-[var(--accent)] no-underline py-1.5 px-3 bg-[var(--bg-tertiary)] rounded-[6px] hover:bg-[var(--accent-muted)]">
                {topicLabel(topic)}
              </A>
            )}
          </For>
        </div>
      </div>

      <div class="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5">
        <For each={topics()}>
          {(topic) => (
            <A
              href={pathWithLang(`/frontier-topics/${topic.id}`, lang())}
              class="block bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-5 shadow-[var(--shadow)] no-underline text-inherit cursor-pointer transition-[border-color,box-shadow] duration-150 ease-[ease] hover:border-[var(--accent)] hover:shadow-[0_2px_8px_rgba(14,165,233,0.15)]"
            >
              <div class="flex justify-between items-start mb-3">
                <h3 class="text-[1.0625rem] font-semibold text-[var(--text-primary)]">{topicLabel(topic)}</h3>
                <span class="text-xs font-mono text-[var(--text-muted)] bg-[var(--bg-tertiary)] py-0.5 px-2 rounded-[6px]">{topic.id}</span>
              </div>
              <p class="text-sm text-[var(--text-secondary)] leading-normal mb-3">{topicDesc(topic)}</p>
              <div class="text-[0.8125rem] text-[var(--text-muted)]">
                <span class="font-semibold text-[var(--text-secondary)] mr-1">{t('frontier.top3')}</span>
                {topic.top_institutions.join(', ')}
              </div>
              <Show when={topic.also_notable && topic.also_notable.length > 0}>
                <div class="text-[0.8125rem] text-[var(--text-muted)] mt-2 pt-2 border-t border-[var(--border-light)]">
                  <span class="font-semibold text-[var(--text-secondary)] mr-1">{t('frontier.also')}</span>
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
