import { Monitor, Moon, Sun } from "lucide-react"
import { type UserTheme, useTheme } from "~/hooks/useTheme"
import { Button } from "./ui/button"

const themes: UserTheme[] = ["light", "dark", "system"]

export function ThemeSelector() {
  const { userTheme, setTheme } = useTheme()

  const cycleTheme = () => {
    const currentIndex = themes.findIndex((t) => t === userTheme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={cycleTheme}
      aria-label={"Click to cycle themes"}
    >
      <Sun className="h-4 w-4 light:not-system:inline hidden" />
      <Moon className="h-4 w-4 dark:not-system:inline hidden" />
      <Monitor className="h-4 w-4 system:inline hidden" />
    </Button>
  )
}
