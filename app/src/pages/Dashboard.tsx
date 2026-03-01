import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLang, pathWithLang } from '../hooks/useLang'
import styles from './Dashboard.module.css'

const stats = [
  { labelKey: 'dashboard.statNobel', value: '633+', unitKey: 'dashboard.unitCount' },
  { labelKey: 'dashboard.statFrontier', value: '20', unitKey: 'dashboard.unitAreas' },
  { labelKey: 'dashboard.statInstitutions', value: '50+', unitKey: 'dashboard.unitInstitutions' },
  { labelKey: 'dashboard.statAwards', value: '19', unitKey: 'dashboard.unitAwards' },
]

export function Dashboard() {
  const { t } = useTranslation()
  const lang = useLang()
  return (
    <div className={styles.dashboard}>
      <h2 className={styles.pageTitle}>{t('dashboard.title')}</h2>
      <p className={styles.pageDesc}>{t('dashboard.desc')}</p>

      <div className={styles.statsGrid}>
        {stats.map((s) => (
          <div key={s.labelKey} className={styles.statCard}>
            <span className={styles.statValue}>
              {s.value}
              <span className={styles.statUnit}>{t(s.unitKey)}</span>
            </span>
            <span className={styles.statLabel}>{t(s.labelKey)}</span>
          </div>
        ))}
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('dashboard.designPrinciples')}</h3>
        <ul className={styles.list}>
          <li>{t('dashboard.principle1')}</li>
          <li>{t('dashboard.principle2')}</li>
          <li>{t('dashboard.principle3')}</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('dashboard.quickLinks')}</h3>
        <div className={styles.linkGrid}>
          <Link to={pathWithLang('/nobel', lang)} className={styles.linkCard}>{t('dashboard.linkNobel')}</Link>
          <Link to={pathWithLang('/awards', lang)} className={styles.linkCard}>{t('dashboard.linkAwards')}</Link>
          <Link to={pathWithLang('/frontier-topics', lang)} className={styles.linkCard}>{t('dashboard.linkFrontier')}</Link>
          <Link to={pathWithLang('/institutions', lang)} className={styles.linkCard}>{t('dashboard.linkInstitutions')}</Link>
        </div>
      </div>
    </div>
  )
}
