import { For } from 'solid-js'
import { useNavigate, useLocation } from '@solidjs/router'
import { Menu } from 'lucide-solid'
import { useI18n } from '../contexts/I18nContext'
import { useLang } from '../hooks/useLang'
import styles from './Header.module.css'

const LANGUAGES = [
  { code: 'en', labelKey: 'lang.en' },
  { code: 'ja', labelKey: 'lang.ja' },
  { code: 'vi', labelKey: 'lang.vi' },
] as const

type HeaderProps = {
  onMenuClick?: () => void
}

export function Header(props: HeaderProps) {
  const { t } = useI18n()
  const navigate = useNavigate()
  const location = useLocation()
  const lang = useLang()

  const handleLangChange = (newLang: string) => {
    const pathWithoutLang = location.pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/dashboard'
    navigate(`/${newLang}${pathWithoutLang}`)
  }

  return (
    <header class={styles.header}>
      <button
        type="button"
        class={styles.menuBtn}
        onClick={props.onMenuClick}
        aria-label="Open menu"
      >
        <Menu size={20} strokeWidth={2} class={styles.menuIcon} aria-hidden />
      </button>
      <h1 class={styles.title}>{t('app.title')}</h1>
      <select
        value={lang()}
        onChange={(e) => handleLangChange(e.currentTarget.value)}
        class={styles.langSelect}
      >
        <For each={LANGUAGES}>
          {({ code, labelKey }) => (
            <option value={code}>{t(labelKey)}</option>
          )}
        </For>
      </select>
    </header>
  )
}
