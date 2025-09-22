import { createIsomorphicFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"
import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"

const resources = {
  en: {
    translation: {
      Welcome: "Welcome",
      submit: {
        header: "Submit an Event",
        description:
          "Share an event with the community by submitting the URL below.",
        seoTitle: "Submit an Event",
        seoDescription: "Submit a new event request on ConfHub",
        card: {
          title: "Event Request",
          description:
            "Enter the URL of the event you'd like to see on our platform.",
        },
        form: {
          urlLabel: "Event URL",
          submit: "Submit Event",
        },
        success: {
          title: "Thank You!",
          description: "Your event request has been submitted successfully.",
          hint: "Our team will review your event soon and add it to the platform.",
          backHome: "Return to Homepage",
          another: "Submit Another Request",
        },
        toast: {
          success: "Event request submitted successfully!",
          error: "Failed to submit event request",
        },
      },
    },
  },
  it: {
    translation: {
      Welcome: "Benvenuto",
      submit: {
        header: "Invia un evento",
        description:
          "Condividi un evento con la community inviando l'URL qui sotto.",
        seoTitle: "Invia un evento",
        seoDescription: "Invia una nuova richiesta di evento su ConfHub",
        card: {
          title: "Richiesta Evento",
          description:
            "Inserisci l'URL dell'evento che vorresti vedere sulla nostra piattaforma.",
        },
        form: {
          urlLabel: "URL dell'evento",
          submit: "Invia evento",
        },
        success: {
          title: "Grazie!",
          description:
            "La tua richiesta di evento è stata inviata con successo.",
          hint: "Il nostro team esaminerà presto il tuo evento e lo aggiungerà alla piattaforma.",
          backHome: "Torna alla Home",
          another: "Invia un'altra richiesta",
        },
        toast: {
          success: "Richiesta evento inviata con successo!",
          error: "Impossibile inviare la richiesta dell'evento",
        },
      },
    },
  },
} as const
export const i18nCookieName = "i18nextLng"

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
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
