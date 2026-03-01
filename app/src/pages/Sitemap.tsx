import { For } from 'solid-js'
import { A } from '@solidjs/router'
import { useI18n } from '../contexts/I18nContext'
import { useLang, pathWithLang } from '../hooks/useLang'
import frontierData from '../../../schema/frontier-topics.json'
import nobelData from '../../../data/nobel-prizes.json'
import tier1Data from '../../../data/tier1-awards-laureates.json'
import styles from './Sitemap.module.css'

const mainPages = [
  { path: '/dashboard', labelKey: 'nav.dashboard' },
  { path: '/nobel/physics', labelKey: 'nav.nobel' },
  { path: '/tier1-awards/abel', labelKey: 'nav.tier1' },
  { path: '/awards', labelKey: 'nav.awards' },
  { path: '/frontier-topics', labelKey: 'nav.frontierTopics' },
  { path: '/institutions', labelKey: 'nav.institutions' },
  { path: '/schema', labelKey: 'nav.schema' },
] as const

const nobelCategories = Object.keys(nobelData.categories) as Array<keyof typeof nobelData.categories>
const tier1AwardIds = Object.keys(tier1Data.awards) as Array<keyof typeof tier1Data.awards>

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
    <div class={styles.page}>
      <h2 class={styles.title}>{t('sitemap.title')}</h2>
      <p class={styles.desc}>{t('sitemap.desc')}</p>

      <section class={styles.section}>
        <h3 class={styles.sectionTitle}>{t('sitemap.mainPages')}</h3>
        <ul class={styles.list}>
          <For each={mainPages}>
            {(item) => (
              <li>
                <A href={pathWithLang(item.path, lang())} class={styles.link}>
                  {t(item.labelKey)}
                </A>
              </li>
            )}
          </For>
        </ul>
      </section>

      <section class={styles.section}>
        <h3 class={styles.sectionTitle}>{t('sitemap.nobelCategories')}</h3>
        <ul class={styles.list}>
          <For each={nobelCategories}>
            {(cat) => (
              <li>
                <A href={pathWithLang(`/nobel/${cat}`, lang())} class={styles.link}>
                  {t(`nobelCategory.${cat}`)}
                </A>
              </li>
            )}
          </For>
        </ul>
      </section>

      <section class={styles.section}>
        <h3 class={styles.sectionTitle}>{t('sitemap.tier1Awards')}</h3>
        <ul class={styles.list}>
          <For each={tier1AwardIds}>
            {(id) => (
              <li>
                <A href={pathWithLang(`/tier1-awards/${id}`, lang())} class={styles.link}>
                  {t(`tier1Award.${id}`)}
                </A>
              </li>
            )}
          </For>
        </ul>
      </section>

      <section class={styles.section}>
        <h3 class={styles.sectionTitle}>{t('sitemap.frontierTopics')}</h3>
        <ul class={styles.list}>
          <For each={topics}>
            {(topic) => (
              <li>
                <A href={pathWithLang(`/frontier-topics/${topic.id}`, lang())} class={styles.link}>
                  {topicLabel(topic)}
                </A>
              </li>
            )}
          </For>
        </ul>
      </section>

      <section class={styles.section}>
        <h3 class={styles.sectionTitle}>{t('sitemap.languages')}</h3>
        <ul class={styles.list}>
          <li>
            <A href={pathWithLang('/sitemap', 'en')} class={styles.link}>English</A>
          </li>
          <li>
            <A href={pathWithLang('/sitemap', 'ja')} class={styles.link}>日本語</A>
          </li>
          <li>
            <A href={pathWithLang('/sitemap', 'vi')} class={styles.link}>Tiếng Việt</A>
          </li>
        </ul>
      </section>
    </div>
  )
}
