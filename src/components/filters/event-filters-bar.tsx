import { format } from "date-fns"
import { CalendarIcon, FilterIcon, X } from "lucide-react"
import React from "react"
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
  ].filter(Boolean).length

  const clearFilters = () => {
    onSetFilters({})
    setQuery("")
  }

  return (
    <Card className="p-4 mb-6 shadow-sm">
      <Accordion
        type="single"
        collapsible
        defaultValue="filters"
        className="w-full"
      >
        <AccordionItem value="filters" className="border-none">
          <AccordionTrigger className="py-0 hover:no-underline">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2 py-1">
                <FilterIcon className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-medium">Event Filters</h2>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary">{activeFiltersCount}</Badge>
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
                  className="flex items-center gap-1"
                >
                  <X className="h-4 w-4" />
                  <span>Clear all</span>
                </Button>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
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
                    />
                  )}
                </div>
                <Input
                  id="event-name"
                  placeholder="Search events by name..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="w-full"
                />
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
                    />
                  )}
                </div>
                <div className="flex items-center gap-2 h-10 px-3 rounded-md border border-input bg-background">
                  <Switch
                    id="cfp-open-switch"
                    checked={!!filters.hasCfpOpen}
                    onCheckedChange={() => toggleBooleanItem("hasCfpOpen")}
                  />
                  <span className="text-sm text-muted-foreground">
                    {filters.hasCfpOpen
                      ? "Only showing events with open CFPs"
                      : "All events"}
                  </span>
                </div>
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
                    />
                  )}
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="start-date"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.startDate ? (
                        format(new Date(filters.startDate), "PPP")
                      ) : (
                        <span className="text-muted-foreground">
                          Pick a date
                        </span>
                      )}
                    </Button>
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
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <Separator className="my-4" />

            <Accordion
              type="single"
              collapsible
              defaultValue="item-1"
              className="w-full"
            >
              <AccordionItem value="item-1" className="border-none">
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
                        />
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {EventModes.map((mode) => (
                        <Badge
                          key={mode}
                          className="cursor-pointer"
                          onClick={() => toggleArrayItem("modes", mode)}
                          variant={
                            filters.modes?.includes(mode)
                              ? "default"
                              : "outline"
                          }
                        >
                          {mode}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="font-medium">Tags</Label>
                      {(filters.tags?.length || 0) > 0 && (
                        <ClearButton
                          onClick={() => setFilter("tags", undefined)}
                        />
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <React.Suspense
                        fallback={
                          <Badge variant="outline">Loading tags...</Badge>
                        }
                      >
                        <Tags
                          selectedTags={filters.tags ?? []}
                          onToggleTag={(tag) => toggleArrayItem("tags", tag)}
                        />
                      </React.Suspense>
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

function ClearButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      size="sm"
      variant="ghost"
      className="h-5 px-2 -mb-2"
      onClick={onClick}
    >
      <X className="h-3 w-3" />
    </Button>
  )
}
