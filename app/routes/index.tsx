import {
  createFileRoute,
  ErrorComponent,
  useNavigate,
} from "@tanstack/react-router";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { z } from "zod";
import { EventCardSkeleton } from "~/components/event-card-skeleton";
import { EventsList } from "~/components/events-list";
import { EventFilters } from "~/components/filters/event-filters";
import { tagQueries } from "~/queries";

const EventModeSchema = z.union([
  z.literal("In person"),
  z.literal("Hybrid"),
  z.literal("Remote"),
]);

export const EventModes = EventModeSchema.options.map((mode) => mode.value);

export const FiltersSchema = z
  .object({
    query: z.string().transform((value) => (value ? value : undefined)),
    tags: z
      .array(z.string())
      .transform((value) => (value?.length ? value : undefined)),
    modes: z
      .array(EventModeSchema)
      .transform((value) => (value?.length ? value : undefined)),
    country: z.string(),
    hasCfpOpen: z.boolean().transform((value) => value || undefined),
  })
  .partial();

export type Filters = z.infer<typeof FiltersSchema>;

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    context.queryClient.ensureQueryData(tagQueries.list());
  },
  component: Home,
  validateSearch: FiltersSchema,
});

const skeletons = Array.from({ length: 2 });

function Home() {
  const navigate = useNavigate();
  const filters = Route.useSearch();

  const setFilters = (newFilters: Filters) => {
    navigate({ from: Route.fullPath, search: newFilters });
  };

  return (
    <main className="flex flex-col items-center">
      <h1 className="text-2xl mt-10 mb-6">Events</h1>
      <div className="flex flex-col gap-4 max-w-6xl w-full px-4">
        <ErrorBoundary
          fallbackRender={(props) => <ErrorComponent error={props.error} />}
        >
          <EventFilters filters={filters} onSetFilters={setFilters} />
        </ErrorBoundary>
        <div className="flex flex-col gap-4">
          <ErrorBoundary
            fallbackRender={(props) => <ErrorComponent error={props.error} />}
          >
            <React.Suspense
              fallback={skeletons.map((_, index) => (
                <EventCardSkeleton key={index} />
              ))}
            >
              <EventsList />
            </React.Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </main>
  );
}
