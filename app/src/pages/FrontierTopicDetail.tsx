import { createEffect, Show, For } from 'solid-js'
import { useParams, A } from '@solidjs/router'
import { useI18n } from '../contexts/I18nContext'
import { useLang, pathWithLang } from '../hooks/useLang'
import frontierData from '../../../schema/frontier-topics.json'

type Topic = {
  id: string
  label_ja: string
  label_en: string
  label_vi?: string
  description: string
  description_en?: string
  description_vi?: string
  infrastructure_premise?: string
  infrastructure_premise_en?: string
  infrastructure_premise_vi?: string
  breakthrough_reason?: string
  breakthrough_reason_en?: string
  breakthrough_reason_vi?: string
  breakthrough_drivers?: string[]
  related_domains?: string[]
  related_fields?: string[]
  top_institutions: string[]
  also_notable?: string[]
}

const topics = frontierData.topics as Topic[]

export function FrontierTopicDetail() {
  const { t, locale } = useI18n()
  const params = useParams<{ id: string }>()
  const lang = useLang()

  const topic = () => topics.find((t) => t.id === params.id)
  const currentIndex = () => topics.findIndex((t) => t.id === params.id)
  const prevTopic = () => {
    const idx = currentIndex()
    return idx > 0 ? topics[idx - 1] : null
  }
  const nextTopic = () => {
    const idx = currentIndex()
    return idx >= 0 && idx < topics.length - 1 ? topics[idx + 1] : null
  }

  const topicLabel = (t: Topic) => {
    const loc = locale()
    if (loc === 'ja') return t.label_ja
    if (loc === 'vi' && t.label_vi) return t.label_vi
    return t.label_en
  }
  const topicSublabel = (t: Topic) => {
    const loc = locale()
    if (loc === 'ja') return t.label_en
    if (loc === 'vi') return t.label_ja
    return t.label_ja
  }
  const topicDesc = (t: Topic) => {
    const loc = locale()
    if (loc === 'en' && t.description_en) return t.description_en
    if (loc === 'vi' && t.description_vi) return t.description_vi
    return t.description
  }
  const topicPremise = (t: Topic) => {
    const loc = locale()
    if (loc === 'en' && t.infrastructure_premise_en) return t.infrastructure_premise_en
    if (loc === 'vi' && t.infrastructure_premise_vi) return t.infrastructure_premise_vi
    return t.infrastructure_premise
  }
  const topicReason = (t: Topic) => {
    const loc = locale()
    if (loc === 'en' && t.breakthrough_reason_en) return t.breakthrough_reason_en
    if (loc === 'vi' && t.breakthrough_reason_vi) return t.breakthrough_reason_vi
    return t.breakthrough_reason
  }

  createEffect(() => {
    const tpc = topic()
    if (tpc) {
      document.title = `${topicLabel(tpc)} - Frontier Topics | GAAS R&D Library`
    }
    return () => {
      document.title = 'GAAS R&D Library'
    }
  })

  return (
    <Show
      when={topic()}
      fallback={
        <div class="max-w-[720px]">
          <p class="text-base text-[var(--text-secondary)] mb-4">{t('frontier.notFound')}</p>
          <A href={pathWithLang('/frontier-topics', lang())} class="inline-block text-sm text-[var(--accent)] no-underline mb-6 hover:underline">
            {t('frontier.back')}
          </A>
        </div>
      }
    >
      {(tpc) => {
        const topic = typeof tpc === 'function' ? tpc() : tpc

        return (
          <div class="max-w-[720px]">
            <A href={pathWithLang('/frontier-topics', lang())} class="inline-block text-sm text-[var(--accent)] no-underline mb-6 hover:underline">
              {t('frontier.back')}
            </A>

            <div class="mb-8">
              <span class="inline-block text-xs font-mono text-[var(--text-muted)] bg-[var(--bg-tertiary)] py-1 px-2.5 rounded-[6px] mb-3">{topic.id}</span>
              <h1 class="text-[1.75rem] font-semibold text-[var(--text-primary)] mb-1">{topicLabel(topic)}</h1>
              <p class="text-base text-[var(--text-muted)]">{topicSublabel(topic)}</p>
            </div>

            <section class="mb-7">
              <h2 class="text-base font-semibold text-[var(--text-secondary)] mb-3">{t('frontier.overview')}</h2>
              <p class="text-base leading-relaxed text-[var(--text-primary)]">{topicDesc(topic)}</p>
            </section>

            <Show when={topicPremise(topic)}>
              <section class="mb-7">
                <h2 class="text-base font-semibold text-[var(--text-secondary)] mb-3">{t('frontier.premise')}</h2>
                <p class="text-base leading-relaxed text-[var(--text-primary)]">{topicPremise(topic)}</p>
              </section>
            </Show>

            <Show when={topicReason(topic)}>
              <section class="mb-7">
                <h2 class="text-base font-semibold text-[var(--text-secondary)] mb-3">{t('frontier.breakthroughReason')}</h2>
                <p class="text-base leading-relaxed text-[var(--text-primary)]">{topicReason(topic)}</p>
              </section>
            </Show>

            <Show when={topic.breakthrough_drivers && topic.breakthrough_drivers.length > 0}>
              <section class="mb-7">
                <h2 class="text-base font-semibold text-[var(--text-secondary)] mb-3">{t('frontier.drivers')}</h2>
                <ul class="list-none m-0 p-0">
                  <For each={topic.breakthrough_drivers!}>
                    {(d) => <li class="text-[0.9375rem] text-[var(--text-primary)] py-1.5 border-b border-[var(--border-light)] last:border-b-0">{d}</li>}
                  </For>
                </ul>
              </section>
            </Show>

            <Show when={topic.related_domains && topic.related_domains.length > 0}>
              <section class="mb-7">
                <h2 class="text-base font-semibold text-[var(--text-secondary)] mb-3">{t('frontier.relatedDomains')}</h2>
                <p class="text-[0.9375rem] text-[var(--text-secondary)] leading-normal">{topic.related_domains!.join(', ')}</p>
              </section>
            </Show>

            <Show when={topic.related_fields && topic.related_fields.length > 0}>
              <section class="mb-7">
                <h2 class="text-base font-semibold text-[var(--text-secondary)] mb-3">{t('frontier.relatedFields')}</h2>
                <p class="text-[0.9375rem] text-[var(--text-secondary)] leading-normal">{topic.related_fields!.join(', ')}</p>
              </section>
            </Show>

            <section class="mb-7">
              <h2 class="text-base font-semibold text-[var(--text-secondary)] mb-3">{t('frontier.topInstitutions')}</h2>
              <ul class="list-none m-0 p-0">
                <For each={topic.top_institutions}>
                  {(inst) => <li class="text-[0.9375rem] text-[var(--text-primary)] py-1.5 border-b border-[var(--border-light)] last:border-b-0">{inst}</li>}
                </For>
              </ul>
            </section>

            <Show when={topic.also_notable && topic.also_notable.length > 0}>
              <section class="mb-7">
                <h2 class="text-base font-semibold text-[var(--text-secondary)] mb-3">{t('frontier.alsoNotable')}</h2>
                <p class="text-[0.9375rem] text-[var(--text-secondary)] leading-normal">{topic.also_notable!.join(', ')}</p>
              </section>
            </Show>

            <nav class="flex justify-between items-center gap-4 mt-10 pt-6 border-t border-[var(--border)]">
              <Show
                when={prevTopic()}
                fallback={<span class="text-sm text-[var(--text-muted)]">{t('frontier.navFirst')}</span>}
              >
                {(prev) => {
                  const p = typeof prev === 'function' ? prev() : prev
                  return (
                    <A href={pathWithLang(`/frontier-topics/${p.id}`, lang())} class="text-sm text-[var(--accent)] no-underline hover:underline">
                      ← {topicLabel(p)}
                    </A>
                  )
                }}
              </Show>
              <A href={pathWithLang('/frontier-topics', lang())} class="text-sm text-[var(--accent)] no-underline hover:underline">
                {t('frontier.navList')}
              </A>
              <Show
                when={nextTopic()}
                fallback={<span class="text-sm text-[var(--text-muted)]">{t('frontier.navLast')}</span>}
              >
                {(next) => {
                  const n = typeof next === 'function' ? next() : next
                  return (
                    <A href={pathWithLang(`/frontier-topics/${n.id}`, lang())} class="text-sm text-[var(--accent)] no-underline hover:underline">
                      {topicLabel(n)} →
                    </A>
                  )
                }}
              </Show>
            </nav>
          </div>
        )
      }}
    </Show>
  )
}
