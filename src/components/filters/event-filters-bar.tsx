import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import React from "react"
import { EventFilters, EventModes } from "src/services/event.schema"
import { Badge } from "~/components/ui/badge"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Switch } from "~/components/ui/switch"
import { Tags } from "./tags"
import { useEventFilters } from "./useEventFilters"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { Calendar } from "~/components/ui/calendar"
import { formatDate } from "~/lib/date"
type Props = {
  filters: EventFilters
  onSetFilters: (newFilters: EventFilters) => void
}

export const EventFiltersBar = ({ filters, onSetFilters }: Props) => {
  const { query, setQuery, toggleArrayItem, toggleBooleanItem, setFilter } =
    useEventFilters(filters, onSetFilters)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center max-w-sm gap-1">
        <Label htmlFor="event-name">Name</Label>
        <Input
          id="event-name"
          placeholder="Event name"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <div className="flex items-center gap-1">
        <Label htmlFor="cfp-open-switch">Has CFP Open</Label>
        <Switch
          id="cfp-open-switch"
          checked={!!filters.hasCfpOpen}
          onCheckedChange={() => toggleBooleanItem("hasCfpOpen")}
        />
      </div>

      <div className="flex items-center gap-1">
        <Label htmlFor="cfp-open-switch">Starts from</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !filters.startDate && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.startDate ? (
                format(filters.startDate, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 flex flex-col gap-2">
            <Calendar
              mode="single"
              selected={
                filters.startDate ? new Date(filters.startDate) : undefined
              }
              onSelect={(date) =>
                setFilter("startDate", date ? formatDate(date) : undefined)
              }
              initialFocus
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilter("startDate", undefined)}
              className="self-end"
            >
              Reset
            </Button>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex gap-1 flex-wrap items-center">
        <Label>Mode</Label>
        {EventModes.map((mode) => (
          <Badge
            key={mode}
            className="cursor-pointer"
            onClick={() => toggleArrayItem("modes", mode)}
            variant={filters.modes?.includes(mode) ? "default" : "outline"}
          >
            {mode}
          </Badge>
        ))}
      </div>

      <div className="flex gap-1 flex-wrap items-center">
        <Label>Tags</Label>
        <React.Suspense fallback={"Loading..."}>
          <Tags
            selectedTags={filters.tags ?? []}
            onToggleTag={(tag) => toggleArrayItem("tags", tag)}
          />
        </React.Suspense>
      </div>
    </div>
  )
}
