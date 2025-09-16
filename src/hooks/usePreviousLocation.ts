import { useEffect, useState } from "react"
import { useRouter } from "@tanstack/react-router"

// Auth related paths where redirecting back would cause loops
const AUTH_PATHS = new Set(["/sign-in", "/sign-up"]) // extend if needed

export function isAuthPath(path?: string) {
  if (!path) return false
  try {
    const url = new URL(
      path,
      globalThis?.location?.origin || "http://localhost",
    )
    return AUTH_PATHS.has(url.pathname)
  } catch {
    return AUTH_PATHS.has(path)
  }
}

export function sanitizeRedirect(target?: string, fallback = "/") {
  if (!target) return fallback
  // Prevent open redirects by only allowing same-origin relative paths
  try {
    // If absolute URL, ensure same origin
    if (/^https?:\/\//i.test(target)) {
      const loc = globalThis?.location
      if (!loc) return fallback
      const url = new URL(target)
      if (url.origin !== loc.origin) return fallback
      target = url.pathname + url.search + url.hash
    }
  } catch {
    return fallback
  }
  // Avoid redirect loops to auth pages
  if (isAuthPath(target)) return fallback
  return target || fallback
}

export function usePreviousLocation() {
  const router = useRouter()
  const [previousLocation, setPreviousLocation] = useState<string>("/")
  useEffect(() => {
    return router.subscribe("onResolved", ({ fromLocation }) => {
      if (fromLocation?.href) {
        const sanitized = sanitizeRedirect(fromLocation.href)
        setPreviousLocation(sanitized)
      }
    })
  }, [router])
  return previousLocation
}
