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
import styles from './Sidebar.module.css'
import pkg from '../../package.json'

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
        [styles.sidebar]: true,
        [styles.open]: props.isOpen ?? false,
      }}
    >
      <div class={styles.logo}>
        <A href={pathWithLang('/dashboard', lang())} class={styles.logoLink} onClick={() => props.onClose?.()}>
          <img src="/gaas-logo.png" alt="GAAS R&D Library" class={styles.logoImage} />
        </A>
        <Show when={props.onClose}>
          <button
            type="button"
            class={styles.closeBtn}
            onClick={props.onClose}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </Show>
      </div>
      <nav class={styles.nav}>
        <For each={menuItems}>
          {({ path, labelKey, Icon }) => (
            <A
              href={pathWithLang(path, lang())}
              onClick={props.onClose}
              class={styles.navItem}
              activeClass={styles.active}
              end
            >
              <span class={styles.navIcon}>
                <Icon size={18} strokeWidth={2} />
              </span>
              {t(labelKey)}
            </A>
          )}
        </For>
      </nav>
      <div class={styles.footer}>
        <p class={styles.copyright}>© <a href="https://www.tanaakk.com/" target="_blank" rel="noopener noreferrer" class={styles.copyrightLink}>TANAAKK</a></p>
        <p class={styles.version}>v{pkg.version}</p>
      </div>
    </aside>
  )
}
