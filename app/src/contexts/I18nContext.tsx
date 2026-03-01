import { createContext, useContext } from 'solid-js'
import type { Lang } from '../i18n'
import { createTranslator } from '../i18n'

export type I18nContextValue = {
  t: (key: string, params?: Record<string, string>) => string
  locale: () => Lang
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}

export function I18nProvider(props: {
  locale: () => Lang
  children: import('solid-js').JSX.Element
}) {
  const t = createTranslator(props.locale)
  const value: I18nContextValue = {
    t,
    locale: props.locale,
  }
  return (
    <I18nContext.Provider value={value}>
      {props.children}
    </I18nContext.Provider>
  )
}
