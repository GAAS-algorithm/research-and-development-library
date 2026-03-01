import * as i18n from '@solid-primitives/i18n'
import { createMemo } from 'solid-js'
import en from './locales/en.json'
import ja from './locales/ja.json'
import vi from './locales/vi.json'

export const SUPPORTED_LANGS = ['en', 'ja', 'vi'] as const
export type Lang = (typeof SUPPORTED_LANGS)[number]

const dictionaries: Record<Lang, Record<string, string>> = {
  en: i18n.flatten(en as Record<string, unknown>) as Record<string, string>,
  ja: i18n.flatten(ja as Record<string, unknown>) as Record<string, string>,
  vi: i18n.flatten(vi as Record<string, unknown>) as Record<string, string>,
}

const STORAGE_KEY = 'gaas-lang'

export function getInitialLang(): Lang {
  if (typeof localStorage === 'undefined') return 'en'
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved && SUPPORTED_LANGS.includes(saved as Lang) ? (saved as Lang) : 'en'
}

export function persistLang(lang: Lang) {
  if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, lang)
}

export function createTranslator(locale: () => Lang) {
  const dict = createMemo(() => dictionaries[locale()] ?? dictionaries.en)
  return i18n.translator(dict, i18n.resolveTemplate)
}
