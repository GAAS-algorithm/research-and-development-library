import { createSignal, createEffect, Show } from 'solid-js'
import { useParams, Navigate } from '@solidjs/router'
import { I18nProvider } from '../contexts/I18nContext'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { Hreflang } from './Hreflang'
import { StructuredData } from './StructuredData'
import { SUPPORTED_LANGS, persistLang } from '../i18n'
import type { Lang } from '../i18n'

export function Layout(props: { children?: import('solid-js').JSX.Element }) {
  const params = useParams<{ lang: string }>()
  const [sidebarOpen, setSidebarOpen] = createSignal(false)

  const validLang = () => {
    const lang = params.lang
    return lang && SUPPORTED_LANGS.includes(lang as Lang)
  }

  createEffect(() => {
    const lang = params.lang
    if (lang && SUPPORTED_LANGS.includes(lang as Lang)) {
      document.documentElement.lang = lang
      persistLang(lang as Lang)
    }
  })

  return (
    <Show when={validLang()} fallback={<Navigate href="/en/dashboard" />}>
      <I18nProvider locale={() => params.lang as Lang}>
        <div class="flex min-h-screen relative">
          <Hreflang />
          <StructuredData />
          <Sidebar isOpen={sidebarOpen()} onClose={() => setSidebarOpen(false)} />
          <div class="flex-1 flex flex-col ml-[260px] min-w-0 md:ml-0">
            <Header onMenuClick={() => setSidebarOpen(true)} />
            <main class="flex-1 p-6 md:p-4 overflow-y-auto">
              {props.children}
            </main>
          </div>
          <Show when={sidebarOpen()}>
            <button
              type="button"
              class="fixed inset-0 bg-black/40 z-[90] border-none cursor-pointer block md:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu"
            />
          </Show>
        </div>
      </I18nProvider>
    </Show>
  )
}
