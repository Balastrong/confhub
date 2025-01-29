import React from "react"
import { EventModes, Filters } from "~/routes"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Switch } from "../ui/switch"
import { Tags } from "./tags"
import { useEventFilters } from "./useEventFilters"
import { Badge } from "../ui/badge"

type Props = {
  filters: Filters
  onSetFilters: (newFilters: Filters) => void
}

export const EventFilters = ({ filters, onSetFilters }: Props) => {
  const { query, setQuery, toggleArrayItem, toggleBooleanItem } =
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
