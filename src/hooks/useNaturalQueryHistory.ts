import { useCallback, useEffect, useState } from "react"
import type { EventFilters } from "src/services/event.schema"

export type NaturalQueryHistoryItem = {
  query: string
  filters: EventFilters
  timestamp: number
}

const STORAGE_KEY = "nl-filter-history"
const MAX_HISTORY = 5

function safeRead(): NaturalQueryHistoryItem[] {
  try {
    if (typeof window === "undefined") return []
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as NaturalQueryHistoryItem[]) : []
  } catch (e) {
    console.error("Failed to read NL filter history", e)
    return []
  }
}

function safeWrite(items: NaturalQueryHistoryItem[]) {
  try {
    if (typeof window === "undefined") return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch (e) {
    console.error("Failed to write NL filter history", e)
  }
}

export function useNaturalQueryHistory() {
  const [history, setHistory] = useState<NaturalQueryHistoryItem[]>([])

  useEffect(() => {
    setHistory(safeRead())
  }, [])

  const add = useCallback((item: { query: string; filters: EventFilters }) => {
    setHistory((prev) => {
      const deduped = prev.filter((h) => h.query !== item.query)
      const next: NaturalQueryHistoryItem[] = [
        { ...item, timestamp: Date.now() },
        ...deduped,
      ].slice(0, MAX_HISTORY)
      safeWrite(next)
      return next
    })
  }, [])

  const remove = useCallback((query: string) => {
    setHistory((prev) => {
      const next = prev.filter((h) => h.query !== query)
      safeWrite(next)
      return next
    })
  }, [])

  const clear = useCallback(() => {
    setHistory([])
    safeWrite([])
  }, [])

  return { history, add, remove, clear }
}
