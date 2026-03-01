#!/usr/bin/env node
/**
 * Generates sitemap.xml for GAAS R&D Library.
 * Run before build: node scripts/generate-sitemap.mjs
 */
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const siteConfig = JSON.parse(
  readFileSync(join(__dirname, '../src/config/site.json'), 'utf-8')
)
const SITE_URL = siteConfig.siteUrl
const LANGS = ['en', 'ja', 'vi']

const staticPaths = [
  '/dashboard',
  '/tier1-awards',
  '/awards',
  '/frontier-topics',
  '/institutions',
  '/schema',
  '/sitemap',
]

// Load Nobel categories
const nobelPath = join(__dirname, '../../data/nobel-prizes.json')
const nobelData = JSON.parse(readFileSync(nobelPath, 'utf-8'))
const nobelCategories = Object.keys(nobelData.categories)

// Load frontier topics
const schemaPath = join(__dirname, '../../schema/frontier-topics.json')
const frontierData = JSON.parse(readFileSync(schemaPath, 'utf-8'))
const topicIds = frontierData.topics.map((t) => t.id)

const today = new Date().toISOString().split('T')[0]

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function urlEntry(pathWithoutLang, lang, priority = 0.8, changefreq = 'weekly') {
  const loc = `${SITE_URL}/${lang}${pathWithoutLang}`
  const links = LANGS.map(
    (l) =>
      `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE_URL}/${l}${pathWithoutLang}"/>`
  )
  links.push(
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/en${pathWithoutLang}"/>`
  )
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
${links.join('\n')}
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

const urls = []

// Nobel category pages (before static so they're added first)
for (const cat of nobelCategories) {
  const path = `/nobel/${cat}`
  for (const lang of LANGS) {
    urls.push(urlEntry(path, lang, 0.8))
  }
}

// Static pages - one entry per language
for (const path of staticPaths) {
  const priority = path === '/dashboard' ? 1.0 : path === '/sitemap' ? 0.5 : 0.8
  for (const lang of LANGS) {
    urls.push(urlEntry(path, lang, priority))
  }
}

// Frontier topic detail pages
for (const id of topicIds) {
  const path = `/frontier-topics/${id}`
  for (const lang of LANGS) {
    urls.push(urlEntry(path, lang, 0.7))
  }
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`

const outPath = join(__dirname, '../public/sitemap.xml')
writeFileSync(outPath, xml, 'utf-8')

// Generate robots.txt with sitemap URL
const robotsPath = join(__dirname, '../public/robots.txt')
const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`
writeFileSync(robotsPath, robotsTxt, 'utf-8')

console.log(`Generated ${outPath} (${urls.length} URLs)`)
console.log(`Generated ${robotsPath}`)