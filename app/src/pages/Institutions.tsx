import { useTranslation } from 'react-i18next'
import institutionsData from '../../../schema/institutions-index.json'
import styles from './Institutions.module.css'

export function Institutions() {
  const { t } = useTranslation()
  const categories = institutionsData.categories as Record<
    string,
    { label_ja: string; institutions: Array<{ id: string; name: string; country: string }> }
  >
  const sources = (institutionsData.sources ?? []) as string[]
  const descFromSchema = (institutionsData.description ?? '') as string

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>{t('institutions.title')}</h2>
      <p className={styles.desc}>{descFromSchema || t('institutions.desc')}</p>

      <div className={styles.screening}>
        <h3 className={styles.screeningTitle}>{t('institutions.screening')}</h3>
        <ul className={styles.screeningList}>
          <li><strong>{t('institutions.criteria')}</strong>{t('institutions.criteriaDesc')}</li>
          <li><strong>{t('institutions.sources')}</strong>{sources.join(', ')}</li>
          <li><strong>{t('institutions.classification')}</strong>{t('institutions.classificationDesc')}</li>
        </ul>
      </div>

      {Object.entries(categories).map(([key, cat]) => (
        <div key={key} className={styles.section}>
          <h3 className={styles.sectionTitle}>{t(`institutionsCategory.${key}`) || cat.label_ja}</h3>
          <div className={styles.grid}>
            {cat.institutions.map((inst) => (
              <div key={inst.id} className={styles.card}>
                <span className={styles.name}>{inst.name}</span>
                <span className={styles.country}>{inst.country}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
