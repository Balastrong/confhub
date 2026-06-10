import { useEffect, useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { useDebounce } from "~/lib/useDebounce"
import { ItemsFilter } from "~/routes/demo/search"

const categoryOptions = [
  { value: "all", label: "All categories" },
  { value: "books", label: "Books" },
  { value: "electronics", label: "Electronics" },
  { value: "clothing", label: "Clothing" },
] as const

export function FilteredList({
  filters,
  onSetFilters,
}: {
  filters: ItemsFilter
  onSetFilters: (filters: ItemsFilter) => void
}) {
  const [queryInput, setQueryInput] = useState(filters.query ?? "")
  const debouncedQuery = useDebounce(queryInput)

  const resetFilters = () => {
    setQueryInput("")
    onSetFilters({})
  }

  useEffect(() => {
    setQueryInput(filters.query ?? "")
  }, [filters.query])

  const setFilter = <TKey extends keyof ItemsFilter>(
    key: TKey,
    value: ItemsFilter[TKey] | undefined,
  ) => {
    onSetFilters({
      ...filters,
      [key]: value,
    })
  }

  useEffect(() => {
    if (debouncedQuery !== queryInput) {
      return
    }

    const normalizedQuery = debouncedQuery.trim()

    if (normalizedQuery !== "" && normalizedQuery.length < 3) {
      return
    }

    const nextQuery = normalizedQuery === "" ? undefined : normalizedQuery

    if (filters.query === nextQuery) {
      return
    }

    setFilter("query", nextQuery)
  }, [debouncedQuery, filters.query, queryInput])

  return (
    <div className="space-y-6 rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="grid gap-2">
          <Label htmlFor="items-query">Query</Label>
          <Input
            id="items-query"
            placeholder="Search items"
            value={queryInput}
            onChange={(event) => setQueryInput(event.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="items-category">Category</Label>
          <Select
            value={filters.category ?? "all"}
            onValueChange={(value) => {
              setFilter("category", value as ItemsFilter["category"])
            }}
          >
            <SelectTrigger id="items-category">
              <SelectValue placeholder="Choose a category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="items-page">Page</Label>
          <Input
            id="items-page"
            type="number"
            min={1}
            placeholder="1"
            value={filters.page?.toString() ?? ""}
            onChange={(event) => {
              const value = event.target.value
              setFilter(
                "page",
                value === "" ? undefined : Math.max(1, Number(value)),
              )
            }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <pre className="overflow-x-auto rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
          {JSON.stringify(filters, null, 2)}
        </pre>
        <Button type="button" variant="outline" onClick={resetFilters}>
          Reset filters
        </Button>
      </div>
    </div>
  )
}
