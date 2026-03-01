import { For } from 'solid-js'
import { A } from '@solidjs/router'
import { useI18n } from '../contexts/I18nContext'
import { useLang, pathWithLang } from '../hooks/useLang'

const stats = [
  { labelKey: 'dashboard.statNobel', value: '633+', unitKey: 'dashboard.unitCount' },
  { labelKey: 'dashboard.statFrontier', value: '20', unitKey: 'dashboard.unitAreas' },
  { labelKey: 'dashboard.statInstitutions', value: '50+', unitKey: 'dashboard.unitInstitutions' },
  { labelKey: 'dashboard.statAwards', value: '19', unitKey: 'dashboard.unitAwards' },
]

export function Dashboard() {
  const { t } = useI18n()
  const lang = useLang()

  return (
    <div class="max-w-[1200px]">
      <h2 class="text-2xl font-semibold text-[var(--text-primary)] mb-2">{t('dashboard.title')}</h2>
      <p class="text-[0.9375rem] text-[var(--text-secondary)] mb-8">{t('dashboard.desc')}</p>

      <div class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 mb-10">
        <For each={stats}>
          {(s) => (
            <div class="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-5 shadow-[var(--shadow)]">
              <span class="block text-[1.75rem] font-bold text-[var(--accent)]">
                {s.value}
                <span class="text-sm font-medium text-[var(--text-muted)] ml-1">{t(s.unitKey)}</span>
              </span>
              <span class="block text-[0.8125rem] text-[var(--text-secondary)] mt-1">{t(s.labelKey)}</span>
            </div>
          )}
        </For>
      </div>

      <div class="mb-8">
        <h3 class="text-lg font-semibold text-[var(--text-primary)] mb-3">{t('dashboard.designPrinciples')}</h3>
        <ul class="list-none">
          <li class="py-2 text-[0.9375rem] text-[var(--text-secondary)] border-b border-[var(--border-light)] last:border-b-0">{t('dashboard.principle1')}</li>
          <li class="py-2 text-[0.9375rem] text-[var(--text-secondary)] border-b border-[var(--border-light)] last:border-b-0">{t('dashboard.principle2')}</li>
          <li class="py-2 text-[0.9375rem] text-[var(--text-secondary)] border-b border-[var(--border-light)] last:border-b-0">{t('dashboard.principle3')}</li>
        </ul>
      </div>

      <div class="mb-8">
        <h3 class="text-lg font-semibold text-[var(--text-primary)] mb-3">{t('dashboard.quickLinks')}</h3>
        <div class="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
          <A href={pathWithLang('/nobel', lang())} class="block py-4 px-5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[0.9375rem] font-medium text-[var(--text-primary)] transition-all duration-150 ease-[ease] hover:border-[var(--accent)] hover:bg-[var(--accent-muted)] hover:text-[var(--accent)] no-underline">{t('dashboard.linkNobel')}</A>
          <A href={pathWithLang('/awards', lang())} class="block py-4 px-5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[0.9375rem] font-medium text-[var(--text-primary)] transition-all duration-150 ease-[ease] hover:border-[var(--accent)] hover:bg-[var(--accent-muted)] hover:text-[var(--accent)] no-underline">{t('dashboard.linkAwards')}</A>
          <A href={pathWithLang('/frontier-topics', lang())} class="block py-4 px-5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[0.9375rem] font-medium text-[var(--text-primary)] transition-all duration-150 ease-[ease] hover:border-[var(--accent)] hover:bg-[var(--accent-muted)] hover:text-[var(--accent)] no-underline">{t('dashboard.linkFrontier')}</A>
          <A href={pathWithLang('/institutions', lang())} class="block py-4 px-5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[0.9375rem] font-medium text-[var(--text-primary)] transition-all duration-150 ease-[ease] hover:border-[var(--accent)] hover:bg-[var(--accent-muted)] hover:text-[var(--accent)] no-underline">{t('dashboard.linkInstitutions')}</A>
        </div>
      </div>
    </div>
  )
}
