import { Monitor, Moon, Sun } from "lucide-react"
import { type Theme, useTheme } from "~/hooks/useTheme"
import { Button } from "./ui/button"

const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
  { value: "light", label: "Light", icon: <Sun className="h-4 w-4" /> },
  { value: "dark", label: "Dark", icon: <Moon className="h-4 w-4" /> },
  { value: "system", label: "System", icon: <Monitor className="h-4 w-4" /> },
]

export function ThemeSelector() {
  const { theme, setTheme, isHydrated } = useTheme()

  const cycleTheme = () => {
    const currentIndex = themes.findIndex((t) => t.value === theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex].value)
  }

  const currentTheme = themes.find((t) => t.value === theme) || themes[2]

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={cycleTheme}
      className={`gap-2 transition-opacity duration-200 ${isHydrated ? "opacity-100" : "opacity-0"}`}
      disabled={!isHydrated}
      title={`Switch to ${themes[(themes.findIndex((t) => t.value === theme) + 1) % themes.length].label} theme`}
    >
      {currentTheme.icon}
      <span className="sr-only">{currentTheme.label} theme</span>
    </Button>
  )
}
