import { useEffect, useState } from "react"

export type Theme = "light" | "dark" | "system"
export type EffectiveTheme = Exclude<Theme, "system">

const THEME_STORAGE_KEY = "confhub-theme"

function getSystemTheme(): EffectiveTheme {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system"
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored
    }
  } catch {
    // localStorage is not available
  }
  return "system"
}

function setStoredTheme(theme: Theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // localStorage is not available
  }
}

function applyTheme(theme: EffectiveTheme) {
  if (typeof document === "undefined") return

  const root = document.documentElement
  if (theme === "dark") {
    root.classList.add("dark")
  } else {
    root.classList.remove("dark")
  }
}

function getEffectiveTheme(theme: Theme): EffectiveTheme {
  return theme === "system" ? getSystemTheme() : theme
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("system")
  const [isHydrated, setIsHydrated] = useState(false)

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    setStoredTheme(newTheme)

    if (isHydrated) {
      const effectiveTheme = getEffectiveTheme(newTheme)
      applyTheme(effectiveTheme)
    }
  }

  useEffect(() => {
    const storedTheme = getStoredTheme()
    setThemeState(storedTheme)
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated || theme !== "system") return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => {
      const effectiveTheme = getEffectiveTheme(theme)
      applyTheme(effectiveTheme)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme, isHydrated])

  const effectiveTheme = getEffectiveTheme(theme)

  return {
    theme,
    setTheme,
    effectiveTheme,
    isHydrated,
  }
}
