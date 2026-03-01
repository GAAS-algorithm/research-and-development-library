import { useParams } from 'react-router-dom'

export const SUPPORTED_LANGS = ['en', 'ja', 'vi'] as const
export type Lang = (typeof SUPPORTED_LANGS)[number]

export function useLang(): Lang {
  const { lang } = useParams<{ lang: string }>()
  const valid = lang && SUPPORTED_LANGS.includes(lang as Lang)
  return (valid ? lang : 'en') as Lang
}

export function pathWithLang(path: string, lang: Lang): string {
  const p = path.startsWith('/') ? path : `/${path}`
  return `/${lang}${p}`
}
