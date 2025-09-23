import "i18next"
import translation from "../locales/en.json"
import { defaultNS } from "./i18n"

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS
    resources: {
      translation: typeof translation
    }
  }
}
