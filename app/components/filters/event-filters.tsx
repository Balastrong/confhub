import { EventModes, Filters, FiltersSchema } from "~/routes";
import { Tags } from "./tags";
import React from "react";
import { Button } from "../ui/button";

type Props = {
  filters: Filters;
  onSetFilters: (newFilters: Filters) => void;
};

type FiltersArrayKeys = keyof {
  [K in keyof Filters as Required<Filters>[K] extends unknown[]
    ? K
    : never]: Filters[K];
};

export const EventFilters = ({ filters, onSetFilters }: Props) => {
  const toggleArrayItem = (key: FiltersArrayKeys, item: string) => {
    const items = filters[key] ?? [];

    const newItems = items.includes(item)
      ? items.filter((f) => f !== item)
      : [...items, item];

    onSetFilters({ ...filters, [key]: newItems });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1 flex-wrap">
        Mode:{" "}
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
      <div className="flex gap-1 flex-wrap">
        Tags:{" "}
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
