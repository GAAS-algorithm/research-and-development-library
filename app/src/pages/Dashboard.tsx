import styles from './Dashboard.module.css'

const stats = [
  { label: 'ノーベル賞エントリ', value: '633+', unit: '件' },
  { label: 'Frontier Topics', value: '20', unit: '領域' },
  { label: '主要機関', value: '50+', unit: '機関' },
  { label: '研究賞', value: '19', unit: '賞' },
]

export function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <h2 className={styles.pageTitle}>ダッシュボード</h2>
      <p className={styles.pageDesc}>
        パッケージ化できない多次元複雑系として設計されたR&D Libraryの概要
      </p>

      <div className={styles.statsGrid}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.statCard}>
            <span className={styles.statValue}>
              {stat.value}
              <span className={styles.statUnit}>{stat.unit}</span>
            </span>
            <span className={styles.statLabel}>{stat.label}</span>
          </div>
        ))}
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>設計原則</h3>
        <ul className={styles.list}>
          <li><strong>Incompressibility Principle</strong> — 一つの階層にまとめられない</li>
          <li><strong>多次元構造</strong> — 複数の判断軸で表現</li>
          <li><strong>双方向共創</strong> — 数学↔R&D の相互影響</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>クイックリンク</h3>
        <div className={styles.linkGrid}>
          <a href="/nobel" className={styles.linkCard}>ノーベル賞データ</a>
          <a href="/awards" className={styles.linkCard}>Breakthrough, Abel, Fields</a>
          <a href="/frontier-topics" className={styles.linkCard}>ブレイクスルー予測領域</a>
          <a href="/institutions" className={styles.linkCard}>機関・抜け漏れチェック</a>
        </div>
      </div>
    </div>
  )
}
