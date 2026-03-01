import { For } from 'solid-js'
import { A } from '@solidjs/router'
import { useI18n } from '../contexts/I18nContext'
import { useLang, pathWithLang } from '../hooks/useLang'
import frontierData from '../../../schema/frontier-topics.json'

const mainPages = [
  { path: '/dashboard', labelKey: 'nav.dashboard' },
  { path: '/nobel', labelKey: 'nav.nobel' },
  { path: '/tier1-awards', labelKey: 'nav.tier1' },
  { path: '/awards', labelKey: 'nav.awards' },
  { path: '/frontier-topics', labelKey: 'nav.frontierTopics' },
  { path: '/institutions', labelKey: 'nav.institutions' },
  { path: '/schema', labelKey: 'nav.schema' },
] as const

const topics = frontierData.topics as Array<{
  id: string
  label_ja: string
  label_en: string
  label_vi?: string
}>

export function Sitemap() {
  const { t, locale } = useI18n()
  const lang = useLang()

  const topicLabel = (topic: { label_ja: string; label_en: string; label_vi?: string }) => {
    const loc = locale()
    if (loc === 'ja') return topic.label_ja
    if (loc === 'vi' && topic.label_vi) return topic.label_vi
    return topic.label_en
  }

  return (
    <div class="max-w-[800px]">
      <h2 class="text-2xl font-semibold text-[var(--text-primary)] mb-2">{t('sitemap.title')}</h2>
      <p class="text-[0.9375rem] text-[var(--text-secondary)] mb-8">{t('sitemap.desc')}</p>

      <section class="mb-8">
        <h3 class="text-lg font-semibold text-[var(--text-primary)] mb-3 pb-2 border-b border-[var(--border-light)]">{t('sitemap.mainPages')}</h3>
        <ul class="list-none m-0 p-0 grid gap-2">
          <For each={mainPages}>
            {(item) => (
              <li>
                <A href={pathWithLang(item.path, lang())} class="block py-2 px-3 text-[var(--text-secondary)] no-underline -mx-3 rounded-[6px] transition-colors duration-150 hover:bg-[var(--bg-tertiary)] hover:text-[var(--accent)]">
                  {t(item.labelKey)}
                </A>
              </li>
            )}
          </For>
        </ul>
      </section>

      <section class="mb-8">
        <h3 class="text-lg font-semibold text-[var(--text-primary)] mb-3 pb-2 border-b border-[var(--border-light)]">{t('sitemap.frontierTopics')}</h3>
        <ul class="list-none m-0 p-0 grid gap-2">
          <For each={topics}>
            {(topic) => (
              <li>
                <A
                  href={pathWithLang(`/frontier-topics/${topic.id}`, lang())}
                  class="block py-2 px-3 text-[var(--text-secondary)] no-underline -mx-3 rounded-[6px] transition-colors duration-150 hover:bg-[var(--bg-tertiary)] hover:text-[var(--accent)]"
                >
                  {topicLabel(topic)}
                </A>
              </li>
            )}
          </For>
        </ul>
      </section>

      <section class="mb-8">
        <h3 class="text-lg font-semibold text-[var(--text-primary)] mb-3 pb-2 border-b border-[var(--border-light)]">{t('sitemap.languages')}</h3>
        <ul class="list-none m-0 p-0 grid gap-2">
          <li>
            <A href={pathWithLang('/sitemap', 'en')} class="block py-2 px-3 text-[var(--text-secondary)] no-underline -mx-3 rounded-[6px] transition-colors duration-150 hover:bg-[var(--bg-tertiary)] hover:text-[var(--accent)]">
              English
            </A>
          </li>
          <li>
            <A href={pathWithLang('/sitemap', 'ja')} class="block py-2 px-3 text-[var(--text-secondary)] no-underline -mx-3 rounded-[6px] transition-colors duration-150 hover:bg-[var(--bg-tertiary)] hover:text-[var(--accent)]">
              日本語
            </A>
          </li>
          <li>
            <A href={pathWithLang('/sitemap', 'vi')} class="block py-2 px-3 text-[var(--text-secondary)] no-underline -mx-3 rounded-[6px] transition-colors duration-150 hover:bg-[var(--bg-tertiary)] hover:text-[var(--accent)]">
              Tiếng Việt
            </A>
          </li>
        </ul>
      </section>
    </div>
  )
}
