import { useTranslation } from 'react-i18next'
import styles from './Header.module.css'

const LANGUAGES = [
  { code: 'en', labelKey: 'lang.en' },
  { code: 'ja', labelKey: 'lang.ja' },
  { code: 'vi', labelKey: 'lang.vi' },
] as const

type HeaderProps = {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { t, i18n } = useTranslation()

  return (
    <header className={styles.header}>
      <button
        type="button"
        className={styles.menuBtn}
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <span className={styles.menuIcon} aria-hidden>☰</span>
      </button>
      <h1 className={styles.title}>{t('app.title')}</h1>
      <select
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        className={styles.langSelect}
      >
        {LANGUAGES.map(({ code, labelKey }) => (
          <option key={code} value={code}>
            {t(labelKey)}
          </option>
        ))}
      </select>
    </header>
  )
}
