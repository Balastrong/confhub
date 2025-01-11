import React from "react";
import { ObjectKeysByValueType } from "~/lib/types";
import { EventModes, Filters } from "~/routes";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Tags } from "./tags";

type Props = {
  filters: Filters;
  onSetFilters: (newFilters: Filters) => void;
};

type FilterBooleanKeys = keyof ObjectKeysByValueType<Filters, boolean>;
type FiltersArrayKeys = keyof ObjectKeysByValueType<Filters, string[]>;

export const EventFilters = ({ filters, onSetFilters }: Props) => {
  const toggleArrayItem = (key: FiltersArrayKeys, item: string) => {
    const items = filters[key] ?? [];

    const newItems = items.includes(item)
      ? items.filter((f) => f !== item)
      : [...items, item];

    onSetFilters({ ...filters, [key]: newItems });
  };

  const toggleBooleanItem = (key: FilterBooleanKeys) => {
    onSetFilters({ ...filters, [key]: filters[key] ? undefined : true });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center space-x-2">
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
          <Button
            key={mode}
            size={"xs"}
            onClick={() => toggleArrayItem("modes", mode)}
            variant={filters.modes?.includes(mode) ? "default" : "outline"}
          >
            {mode}
          </Button>
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
  );
};
