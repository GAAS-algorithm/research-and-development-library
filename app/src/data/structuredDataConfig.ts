/**
 * Route to translation key mapping for structured data.
 * Path pattern -> { nameKey, descKey } for WebPage schema.
 */
export const PAGE_META: Record<string, { nameKey: string; descKey: string }> = {
  dashboard: { nameKey: 'nav.dashboard', descKey: 'dashboard.desc' },
  nobel: { nameKey: 'nav.nobel', descKey: 'nobel.desc' },
  'tier1-awards': { nameKey: 'nav.tier1', descKey: 'tier1.desc' },
  awards: { nameKey: 'nav.awards', descKey: 'awards.desc' },
  'frontier-topics': { nameKey: 'nav.frontierTopics', descKey: 'frontier.desc' },
  institutions: { nameKey: 'nav.institutions', descKey: 'institutions.desc' },
  schema: { nameKey: 'nav.schema', descKey: 'schema.desc' },
  sitemap: { nameKey: 'nav.sitemap', descKey: 'sitemap.desc' },
}

export const LANG_BCP47: Record<string, string> = {
  en: 'en',
  ja: 'ja',
  vi: 'vi',
}
