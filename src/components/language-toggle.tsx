import { Languages } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

type LangCode = "en" | "it"

function normalizeLang(code: string): LangCode {
  const short = code.toLowerCase().slice(0, 2)
  return short === "it" ? "it" : "en"
}

const LANG_META: Record<
  LangCode,
  { code: LangCode; label: string; flag: string }
> = {
  en: { code: "en", label: "English", flag: "🇬🇧" },
  it: { code: "it", label: "Italiano", flag: "🇮🇹" },
}

export function LanguageToggle() {
  const { i18n, t } = useTranslation()

  const current = normalizeLang(i18n.language || "en")

  const setLanguage = (lng: LangCode) => {
    if (normalizeLang(i18n.language || "en") !== lng) {
      i18n.changeLanguage(lng)
    }
  }

  const meta = LANG_META[current]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 px-2 w-15 itemxs-center justify-between"
          aria-label={t("Change language", { defaultValue: "Change language" })}
        >
          <Languages className="size-4" />
          <span className="text-sm tabular-nums">
            {meta.code.toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        <DropdownMenuLabel>
          {t("Language", { defaultValue: "Language" })}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={current}
          onValueChange={(v) => setLanguage(normalizeLang(v))}
        >
          {(Object.keys(LANG_META) as LangCode[]).map((key) => {
            const m = LANG_META[key]
            return (
              <DropdownMenuRadioItem
                key={key}
                value={key}
                className="cursor-pointer"
              >
                <span className="mr-2" aria-hidden>
                  {m.flag}
                </span>
                <span className="mr-1 font-medium">{m.code.toUpperCase()}</span>
                <span className="text-muted-foreground">{m.label}</span>
              </DropdownMenuRadioItem>
            )
          })}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        {/* Fallback items for environments without radio semantics (optional) */}
        <DropdownMenuItem
          className="hidden"
          onSelect={(e) => e.preventDefault()}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default LanguageToggle
