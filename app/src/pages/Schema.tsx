import rdCategories from '../../../schema/rd-categories.json'
import styles from './Schema.module.css'

type FileDesc = { file: string; description: string }

export function Schema() {
  const categories = rdCategories.categories as Record<string, FileDesc>
  const extra = [
    rdCategories.nobel_prizes,
    rdCategories.research_awards,
    rdCategories.major_awards_detail,
    rdCategories.institutions_index,
  ].filter(Boolean) as FileDesc[]

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>スキーマ</h2>
      <p className={styles.desc}>
        パッケージ化できない多次元複雑系。学術主軸・産業補助軸・複数判断軸。
      </p>

      <div className={styles.coreConcept}>
        <h3>中核概念</h3>
        <p className={styles.conceptLabel}>
          {rdCategories.core_concept?.label_ja || '多次元複雑系'}
        </p>
        <p className={styles.conceptDesc}>
          {rdCategories.core_concept?.description || ''}
        </p>
      </div>

      <div className={styles.fileList}>
        <h3>ファイル構成</h3>
        {Object.entries(categories).map(([key, cat]) => (
          <div key={key} className={styles.fileItem}>
            <code className={styles.fileName}>{cat.file}</code>
            <span className={styles.fileDesc}>{cat.description}</span>
          </div>
        ))}
        {extra.map((item) => (
          <div key={item.file} className={styles.fileItem}>
            <code className={styles.fileName}>{item.file}</code>
            <span className={styles.fileDesc}>{item.description}</span>
          </div>
        ))}
      </div>

      <div className={styles.principles}>
        <h3>原則</h3>
        <ul>
          {(rdCategories.principles as string[]).map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
