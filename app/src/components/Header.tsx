import { For } from 'solid-js'
import { useNavigate, useLocation } from '@solidjs/router'
import { Menu } from 'lucide-solid'
import { useI18n } from '../contexts/I18nContext'
import { useLang } from '../hooks/useLang'

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
    <header class="h-14 px-6 flex items-center justify-between gap-3 bg-[var(--bg-secondary)] border-b border-[var(--border)] md:px-4">
      <button
        type="button"
        class="hidden md:flex md:items-center md:justify-center p-2 -m-2 -ml-2 border-none bg-transparent text-[var(--text-primary)] cursor-pointer rounded-[6px] hover:bg-[var(--bg-tertiary)]"
        onClick={props.onMenuClick}
        aria-label="Open menu"
      >
        <Menu size={20} class="text-xl leading-none" aria-hidden />
      </button>
      <h1 class="text-xl font-semibold text-[var(--text-primary)] md:text-base md:flex-1 md:min-w-0 md:overflow-hidden md:text-ellipsis md:whitespace-nowrap">{t('app.title')}</h1>
      <select
        value={lang()}
        onChange={(e) => handleLangChange(e.currentTarget.value)}
        class="py-1.5 px-3 text-[0.8125rem] border border-[var(--border)] rounded-[6px] bg-[var(--bg-primary)] text-[var(--text-primary)] cursor-pointer hover:border-[var(--accent)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-muted)] md:py-1.5 md:px-2.5 md:text-xs md:shrink-0"
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
