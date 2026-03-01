import { useParams } from '@solidjs/router'
import { createMemo } from 'solid-js'
import { SUPPORTED_LANGS } from '../i18n'
import type { Lang } from '../i18n'

export { SUPPORTED_LANGS }
export type { Lang }

export function useLang(): () => Lang {
  const params = useParams<{ lang: string }>()
  return createMemo(() => {
    const lang = params.lang
    const valid = lang && SUPPORTED_LANGS.includes(lang as Lang)
    return (valid ? lang : 'en') as Lang
  })
}

export function pathWithLang(path: string, lang: Lang): string {
  const p = path.startsWith('/') ? path : `/${path}`
  return `/${lang}${p}`
}
