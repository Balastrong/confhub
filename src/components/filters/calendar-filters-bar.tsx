import { FilterIcon, X } from "lucide-react"
import { getEventModeConfig } from "src/lib/event-modes"
import { EventFilters, EventModes } from "src/services/event.schema"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Card } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Switch } from "~/components/ui/switch"
import { CountrySelect } from "./country-select"
import { useEventFilters } from "./useEventFilters"

type Props = {
  filters: EventFilters
  onSetFilters: (newFilters: EventFilters) => void
}

export function CalendarFiltersBar({ filters, onSetFilters }: Props) {
  const { query, setQuery, toggleArrayItem, toggleBooleanItem, setFilter } =
    useEventFilters(filters, onSetFilters)

  const activeFiltersCount = [
    !!filters.query,
    !!filters.hasCfpOpen,
    (filters.modes?.length || 0) > 0,
    !!filters.country,
  ].filter(Boolean).length

  const clearFilters = () => {
    onSetFilters({})
    setQuery("")
  }

  return (
    <Card className="p-4 shadow-xs" aria-label="Calendar filters" role="region">
      <div className="flex items-center gap-2 mb-3">
        <FilterIcon className="h-5 w-5 text-primary" />
        <span className="text-lg font-medium">Filter Events</span>
        {activeFiltersCount > 0 && (
          <Badge variant="secondary" aria-live="polite">
            {activeFiltersCount}
          </Badge>
        )}
        {activeFiltersCount > 0 && (
          <Button
            size="sm"
            variant="ghost"
            onClick={clearFilters}
            className="ml-auto -mr-2"
            aria-label="Clear all active filters"
          >
            <X className="h-4 w-4" />
            <span className="ml-1">Clear all</span>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {/* Name filter */}
        <div className="space-y-2">
          <div className="flex items-end justify-between">
            <Label htmlFor="calendar-event-name" className="font-medium">
              Name
            </Label>
            {filters.query && (
              <SmallClearButton
                onClick={() => {
                  setQuery("")
                  setFilter("query", undefined)
                }}
                aria-label="Clear name filter"
              />
            )}
          </div>
          <Input
            id="calendar-event-name"
            placeholder="Search events by name..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full"
          />
        </div>

        {/* Country filter */}
        <div className="space-y-2">
          <div className="flex items-end justify-between">
            <Label className="font-medium">Country</Label>
            {filters.country && (
              <SmallClearButton onClick={() => setFilter("country", undefined)} />
            )}
          </div>
          <CountrySelect
            value={filters.country}
            onChange={(value) => setFilter("country", value)}
            placeholder="All countries"
          />
        </div>

        {/* CFP filter */}
        <div className="space-y-2">
          <div className="flex items-end justify-between">
            <Label htmlFor="calendar-cfp-open-switch" className="font-medium">
              CFP open
            </Label>
            {filters.hasCfpOpen && (
              <SmallClearButton
                onClick={() => toggleBooleanItem("hasCfpOpen")}
                aria-label="Clear CFP status filter"
              />
            )}
          </div>
          <div className="flex items-center gap-2 h-10 px-3 rounded-md border border-input bg-background">
            <Switch
              id="calendar-cfp-open-switch"
              checked={!!filters.hasCfpOpen}
              onCheckedChange={() => toggleBooleanItem("hasCfpOpen")}
            />
            <span className="text-sm text-muted-foreground">
              {filters.hasCfpOpen ? "Only open CFPs" : "All events"}
            </span>
          </div>
        </div>

        {/* Modes */}
        <div className="space-y-2">
          <div className="flex items-end justify-between">
            <Label className="font-medium">Modes</Label>
            {(filters.modes?.length || 0) > 0 && (
              <SmallClearButton onClick={() => setFilter("modes", undefined)} />
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {EventModes.map((mode) => {
              const modeConfig = getEventModeConfig(mode)
              const Icon = modeConfig.icon
              const selected = !!filters.modes?.includes(mode)
              return (
                <Badge
                  key={mode}
                  className="cursor-pointer flex items-center gap-1"
                  onClick={() => toggleArrayItem("modes", mode)}
                  tabIndex={0}
                  role="checkbox"
                  aria-checked={selected}
                  variant={selected ? "default" : "outline"}
                >
                  <Icon className="h-3 w-3" />
                  {modeConfig.label}
                </Badge>
              )
            })}
          </div>
        </div>
      </div>
    </Card>
  )
}

function SmallClearButton({
  onClick,
  ...props
}: { onClick: () => void } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button
      size="sm"
      variant="ghost"
      className="h-5 px-2 -mb-2"
      onClick={onClick}
      {...props}
    >
      <X className="h-3 w-3" aria-hidden="true" />
    </Button>
  )
}
