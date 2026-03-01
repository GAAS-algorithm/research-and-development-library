import { Show, For } from 'solid-js'
import { A } from '@solidjs/router'
import {
  LayoutDashboard,
  Trophy,
  Medal,
  Award,
  Microscope,
  Building2,
  Ruler,
  Map,
  X,
} from 'lucide-solid'
import { useI18n } from '../contexts/I18nContext'
import { useLang, pathWithLang } from '../hooks/useLang'

const menuItems = [
  { path: '/dashboard', labelKey: 'nav.dashboard', Icon: LayoutDashboard },
  { path: '/nobel', labelKey: 'nav.nobel', Icon: Trophy },
  { path: '/tier1-awards', labelKey: 'nav.tier1', Icon: Medal },
  { path: '/awards', labelKey: 'nav.awards', Icon: Award },
  { path: '/frontier-topics', labelKey: 'nav.frontierTopics', Icon: Microscope },
  { path: '/institutions', labelKey: 'nav.institutions', Icon: Building2 },
  { path: '/schema', labelKey: 'nav.schema', Icon: Ruler },
  { path: '/sitemap', labelKey: 'nav.sitemap', Icon: Map },
]

type SidebarProps = {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar(props: SidebarProps) {
  const { t } = useI18n()
  const lang = useLang()

  return (
    <aside
      classList={{
        'fixed left-0 top-0 bottom-0 w-[260px] bg-[var(--bg-secondary)] border-r border-[var(--border)] flex flex-col z-[100] transition-transform duration-200 ease-[ease]': true,
        '-translate-x-full invisible md:translate-x-0 md:visible': !(props.isOpen ?? false),
        'translate-x-0 visible shadow-[4px_0_24px_rgba(0,0,0,0.15)]': props.isOpen ?? false,
      }}
    >
      <div class="py-5 px-6 border-b border-[var(--border-light)] flex items-center gap-2.5 relative md:pr-3">
        <A href={pathWithLang('/dashboard', lang())} class="flex items-center no-underline" onClick={() => props.onClose?.()}>
          <img src="/gaas-logo.png" alt="GAAS R&D Library" class="max-h-10 max-w-full w-auto object-contain" />
        </A>
        <Show when={props.onClose}>
          <button
            type="button"
            class="ml-auto py-1.5 px-2.5 border-none bg-[var(--bg-tertiary)] text-[var(--text-secondary)] text-base cursor-pointer rounded-[6px] hover:bg-[var(--border)] hover:text-[var(--text-primary)] hidden md:flex md:items-center md:justify-center"
            onClick={props.onClose}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </Show>
      </div>
      <nav class="flex-1 py-4 px-3 overflow-y-auto">
        <For each={menuItems}>
          {({ path, labelKey, Icon }) => (
            <A
              href={pathWithLang(path, lang())}
              onClick={props.onClose}
              class="flex items-center gap-3 py-3 px-4 rounded-lg text-[var(--text-secondary)] text-[0.9375rem] font-medium mb-1 transition-all duration-150 ease-[ease] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] data-[active]:bg-[var(--accent-muted)] data-[active]:text-[var(--accent)]"
              activeClass="!bg-[var(--accent-muted)] !text-[var(--accent)]"
              end
            >
              <span class="text-lg"><Icon size={18} strokeWidth={2} /></span>
              {t(labelKey)}
            </A>
          )}
        </For>
      </nav>
      <div class="py-4 px-6 border-t border-[var(--border-light)]">
        <p class="text-[0.6875rem] text-[var(--text-muted)] m-0">© <a href="https://www.tanaakk.com/" target="_blank" rel="noopener noreferrer" class="text-inherit no-underline hover:text-[var(--accent)] hover:underline">TANAAKK</a></p>
      </div>
    </aside>
  )
}
