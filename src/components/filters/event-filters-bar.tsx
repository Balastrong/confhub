import { format } from "date-fns"
import { CalendarIcon, FilterIcon, X } from "lucide-react"
import { getEventModeConfig } from "src/lib/event-modes"
import { EventFilters, EventModes } from "src/services/event.schema"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Calendar } from "~/components/ui/calendar"
import { Card } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { Separator } from "~/components/ui/separator"
import { Switch } from "~/components/ui/switch"
import { formatDate } from "~/lib/date"
import { Tags } from "./tags"
import { useEventFilters } from "./useEventFilters"
import { CountrySelect } from "./country-select"

type Props = {
  filters: EventFilters
  onSetFilters: (newFilters: EventFilters) => void
}

export const EventFiltersBar = ({ filters, onSetFilters }: Props) => {
  const { query, setQuery, toggleArrayItem, toggleBooleanItem, setFilter } =
    useEventFilters(filters, onSetFilters)

  // Count active filters
  const activeFiltersCount = [
    !!filters.query,
    !!filters.hasCfpOpen,
    !!filters.startDate,
    (filters.modes?.length || 0) > 0,
    (filters.tags?.length || 0) > 0,
    !!filters.country,
  ].filter(Boolean).length

  const clearFilters = () => {
    onSetFilters({})
    setQuery("")
  }

  return (
    <Card className="p-4 shadow-xs" aria-label="Event filters" role="region">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="filters" className="border-none">
          <AccordionTrigger className="py-0" headingLevel={2}>
            <div className="flex items-center gap-2">
              <FilterIcon className="h-5 w-5 text-primary" />
              <span className="text-lg font-medium" id="event-filters-heading">
                Filters Events
              </span>
              {activeFiltersCount > 0 && (
                <Badge
                  variant="secondary"
                  aria-label={`${activeFiltersCount} active filter${activeFiltersCount === 1 ? "" : "s"}`}
                  aria-live="polite"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </div>
            {activeFiltersCount > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.preventDefault()
                  clearFilters()
                }}
                className="flex items-center gap-1 ml-auto mr-2 -mt-2 -mb-2 no-underline"
                aria-label="Clear all active filters"
              >
                <X className="h-4 w-4" />
                <span>Clear all</span>
              </Button>
            )}
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
              {/* Name filter */}
              <div className="space-y-2">
                <div className="flex items-end justify-between">
                  <Label htmlFor="event-name" className="font-medium">
                    Name
                  </Label>
                  {filters.query && (
                    <ClearButton
                      onClick={() => {
                        setQuery("")
                        setFilter("query", undefined)
                      }}
                      aria-label="Clear name filter"
                    />
                  )}
                </div>
                <Input
                  id="event-name"
                  placeholder="Search events by name..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="w-full"
                  aria-describedby="event-name-hint"
                />
                <p id="event-name-hint" className="sr-only">
                  Type to filter events by their name
                </p>
              </div>

              {/* CFP filter */}
              <div className="space-y-2">
                <div className="flex items-end justify-between">
                  <Label htmlFor="cfp-open-switch" className="font-medium">
                    CFP Status
                  </Label>
                  {filters.hasCfpOpen && (
                    <ClearButton
                      onClick={() => toggleBooleanItem("hasCfpOpen")}
                      aria-label="Clear CFP status filter"
                    />
                  )}
                </div>
                <div className="flex items-center gap-2 h-10 px-3 rounded-md border border-input bg-background">
                  <Switch
                    id="cfp-open-switch"
                    checked={!!filters.hasCfpOpen}
                    onCheckedChange={() => toggleBooleanItem("hasCfpOpen")}
                    aria-describedby="cfp-open-switch-desc"
                  />
                  <span className="text-sm text-muted-foreground">
                    {filters.hasCfpOpen
                      ? "Only showing events with open CFPs"
                      : "All events"}
                  </span>
                </div>
                <p id="cfp-open-switch-desc" className="sr-only">
                  Toggle to only show events with an open call for papers
                </p>
              </div>

              {/* Date filter */}
              <div className="space-y-2">
                <div className="flex items-end justify-between">
                  <Label htmlFor="start-date" className="font-medium">
                    Start Date
                  </Label>
                  {filters.startDate && (
                    <ClearButton
                      onClick={() => setFilter("startDate", undefined)}
                      aria-label="Clear start date filter"
                    />
                  )}
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 h-10 px-3 rounded-md border border-input bg-background cursor-pointer text-left"
                      aria-label={
                        filters.startDate
                          ? `Change start date filter, currently ${format(
                              new Date(filters.startDate),
                              "PPP",
                            )}`
                          : "Pick a start date"
                      }
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      <span className="text-sm text-muted-foreground">
                        {filters.startDate
                          ? format(new Date(filters.startDate), "PPP")
                          : "Pick a date"}
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        filters.startDate
                          ? new Date(filters.startDate)
                          : undefined
                      }
                      onSelect={(date) =>
                        setFilter(
                          "startDate",
                          date ? formatDate(date) : undefined,
                        )
                      }
                      initialFocus
                      aria-label="Calendar to pick start date"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Country filter */}
              <div className="space-y-2 md:col-span-2 lg:col-span-1">
                <div className="flex items-end justify-between">
                  <Label className="font-medium">Country</Label>
                  {filters.country && (
                    <ClearButton
                      onClick={() => setFilter("country", undefined)}
                    />
                  )}
                </div>
                <CountrySelect
                  value={filters.country}
                  onChange={(value) => setFilter("country", value)}
                  placeholder="All countries"
                />
              </div>
            </div>

            <Separator className="my-4" />

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="extra-filters" className="border-none">
                <AccordionTrigger className="py-2">
                  <div className="flex items-center gap-2">
                    <span>Additional Filters</span>
                    {(filters.modes?.length || 0) +
                      (filters.tags?.length || 0) >
                      0 && (
                      <Badge variant="secondary">
                        {(filters.modes?.length || 0) +
                          (filters.tags?.length || 0)}
                      </Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 py-2">
                  {/* Event Modes */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="font-medium">Event Mode</Label>
                      {(filters.modes?.length || 0) > 0 && (
                        <ClearButton
                          onClick={() => setFilter("modes", undefined)}
                          aria-label="Clear event mode filters"
                        />
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {EventModes.map((mode) => {
                        const modeConfig = getEventModeConfig(mode)
                        const IconComponent = modeConfig.icon
                        return (
                          <Badge
                            key={mode}
                            className="cursor-pointer flex items-center gap-1 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            onClick={() => toggleArrayItem("modes", mode)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault()
                                toggleArrayItem("modes", mode)
                              }
                            }}
                            tabIndex={0}
                            role="checkbox"
                            aria-checked={
                              filters.modes?.includes(mode) || false
                            }
                            aria-label={`Filter by ${modeConfig.label} events`}
                            variant={
                              filters.modes?.includes(mode)
                                ? "default"
                                : "outline"
                            }
                          >
                            <IconComponent className="h-3 w-3" />
                            {modeConfig.label}
                          </Badge>
                        )
                      })}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="font-medium">Tags</Label>
                      {(filters.tags?.length || 0) > 0 && (
                        <ClearButton
                          onClick={() => setFilter("tags", undefined)}
                          aria-label="Clear tag filters"
                        />
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Tags
                        selectedTags={filters.tags ?? []}
                        onToggleTag={(tag) => toggleArrayItem("tags", tag)}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  )
}

function ClearButton({
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
