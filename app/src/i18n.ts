import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import ja from './locales/ja.json'
import vi from './locales/vi.json'

const resources = {
  en: { translation: en },
  ja: { translation: ja },
  vi: { translation: vi },
}

const savedLng = typeof localStorage !== 'undefined' ? localStorage.getItem('gaas-lang') : null
const initialLng = savedLng && ['en', 'ja', 'vi'].includes(savedLng) ? savedLng : 'en'

i18n.use(initReactI18next).init({
  resources,
  lng: initialLng,
  fallbackLng: 'en',
  supportedLngs: ['en', 'ja', 'vi'],
  interpolation: { escapeValue: false },
})

i18n.on('languageChanged', (lng) => {
  if (typeof localStorage !== 'undefined') localStorage.setItem('gaas-lang', lng)
})

export default i18n
