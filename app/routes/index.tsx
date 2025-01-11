import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React from "react";
import { EventCardSkeleton } from "~/components/event-card-skeleton";
import { EventFilters } from "~/components/event-filters";
import { EventsList } from "~/components/events-list";
import { z } from "zod";

const FiltersSchema = z
  .object({
    tags: z.array(z.string()),
  })
  .partial();

export const Route = createFileRoute("/")({
  component: Home,
  validateSearch: FiltersSchema,
});

const skeletons = Array.from({ length: 2 });

function Home() {
  const navigate = useNavigate();
  const { tags = [] } = Route.useSearch();

  const toggleTag = (tag: string) => {
    const newtags = tags.includes(tag)
      ? tags.filter((f) => f !== tag)
      : [...tags, tag];

    const search = newtags.length ? { tags: newtags } : {};

    navigate({
      to: Route.fullPath,
      search,
    });
  };

  return (
    <main className="flex flex-col items-center">
      <h1 className="text-2xl mt-10 mb-6">Events</h1>
      <div className="flex flex-col gap-4 max-w-6xl w-full px-4">
        <div className="flex gap-1 items-center flex-wrap">
          Filters: {/* TODO: Extract Skeleton */}
          <React.Suspense fallback={"Loading..."}>
            <EventFilters selectedFilters={tags} onToggleFilter={toggleTag} />
          </React.Suspense>
        </div>
        <div className="flex flex-col gap-4">
          <React.Suspense
            fallback={skeletons.map((_, index) => (
              <EventCardSkeleton key={index} />
            ))}
          >
            <EventsList />
          </React.Suspense>
        </div>
      </div>
    </main>
  );
}
