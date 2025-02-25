import { useEffect, useState } from "react"
import { ObjectKeysByValueType } from "~/lib/types"
import { useDebounce } from "~/lib/useDebounce"
import { EventFilters } from "~/services/event.schema"

type FilterBooleanKeys = keyof ObjectKeysByValueType<EventFilters, boolean>
type FiltersArrayKeys = keyof ObjectKeysByValueType<EventFilters, string[]>

export const useEventFilters = (
  filters: EventFilters,
  onSetFilters: (newFilters: EventFilters) => void,
) => {
  const [query, setQuery] = useState(filters.query ?? "")

  const toggleArrayItem = (key: FiltersArrayKeys, item: string) => {
    const items = filters[key] ?? []

    const newItems = items.includes(item)
      ? items.filter((f) => f !== item)
      : [...items, item]

    onSetFilters({ ...filters, [key]: newItems })
  }

  const toggleBooleanItem = (key: FilterBooleanKeys) => {
    onSetFilters({ ...filters, [key]: filters[key] ? undefined : true })
  }

  const setFilter = (key: keyof EventFilters, value: string) => {
    onSetFilters({ ...filters, [key]: value })
  }

  const debouncedQuery = useDebounce(query)

  useEffect(() => {
    setFilter("query", debouncedQuery)
  }, [debouncedQuery])

  return {
    query,
    setQuery,
    toggleArrayItem,
    toggleBooleanItem,
    filters,
  }
}
