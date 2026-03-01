import { For } from 'solid-js'
import { A } from '@solidjs/router'
import { useI18n } from '../contexts/I18nContext'
import { useLang, pathWithLang } from '../hooks/useLang'
import styles from './Dashboard.module.css'

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
    <div class={styles.dashboard}>
      <h2 class={styles.pageTitle}>{t('dashboard.title')}</h2>
      <p class={styles.pageDesc}>{t('dashboard.desc')}</p>

      <div class={styles.statsGrid}>
        <For each={stats}>
          {(s) => (
            <div class={styles.statCard}>
              <span class={styles.statValue}>
                {s.value}
                <span class={styles.statUnit}>{t(s.unitKey)}</span>
              </span>
              <span class={styles.statLabel}>{t(s.labelKey)}</span>
            </div>
          )}
        </For>
      </div>

      <div class={styles.section}>
        <h3 class={styles.sectionTitle}>{t('dashboard.designPrinciples')}</h3>
        <ul class={styles.list}>
          <li>{t('dashboard.principle1')}</li>
          <li>{t('dashboard.principle2')}</li>
          <li>{t('dashboard.principle3')}</li>
        </ul>
      </div>

      <div class={styles.section}>
        <h3 class={styles.sectionTitle}>{t('dashboard.quickLinks')}</h3>
        <div class={styles.linkGrid}>
          <A href={pathWithLang('/nobel', lang())} class={styles.linkCard}>{t('dashboard.linkNobel')}</A>
          <A href={pathWithLang('/awards', lang())} class={styles.linkCard}>{t('dashboard.linkAwards')}</A>
          <A href={pathWithLang('/frontier-topics', lang())} class={styles.linkCard}>{t('dashboard.linkFrontier')}</A>
          <A href={pathWithLang('/institutions', lang())} class={styles.linkCard}>{t('dashboard.linkInstitutions')}</A>
        </div>
      </div>
    </div>
  )
}
