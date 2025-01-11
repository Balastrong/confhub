import { Filters } from "~/routes";
import { Tags } from "./tags";
import React from "react";

type Props = {
  filters: Filters;
  onSetFilters: (newFilters: Filters) => void;
};

export const EventFilters = ({ filters, onSetFilters }: Props) => {
  console.log("Rerender Filters", filters);
  const onToggleTag = (tag: string) => {
    const tags = filters.tags ?? [];

    const newTags = tags.includes(tag)
      ? tags.filter((f) => f !== tag)
      : [...tags, tag];

    onSetFilters({ tags: newTags });
  };

  return (
    <div>
      <div className="flex gap-1 flex-wrap">
        Tags:{" "}
        <React.Suspense fallback={"Loading..."}>
          <Tags selectedTags={filters.tags ?? []} onToggleTag={onToggleTag} />
        </React.Suspense>
      </div>
    </div>
  );
};
