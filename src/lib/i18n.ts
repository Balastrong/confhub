import { createIsomorphicFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"
import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"
import enTranslations from "../locales/en.json"
import itTranslations from "../locales/it.json"

export const resources = {
  en: {
    translation: enTranslations,
  },
  it: {
    translation: itTranslations,
  },
} as const

export const defaultNS = "translation"

const i18nCookieName = "i18nextLng"

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    defaultNS,
    fallbackLng: "en",
    supportedLngs: ["en", "it"],
    detection: {
      order: ["cookie"],
      lookupCookie: i18nCookieName,
      caches: ["cookie"],
      cookieMinutes: 60 * 24 * 365,
    },
    interpolation: { escapeValue: false },
  })

export const setSSRLanguage = createIsomorphicFn().server(async () => {
  const language = getCookie(i18nCookieName)
  await i18n.changeLanguage(language || "en")
})

export default i18n
