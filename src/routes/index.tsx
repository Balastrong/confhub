import {
  createFileRoute,
  ErrorComponent,
  useNavigate,
} from "@tanstack/react-router"
import React from "react"
import { ErrorBoundary } from "react-error-boundary"
import { EventCardSkeleton } from "src/components/event/event-card-skeleton"
import { EventsList } from "src/components/event/events-list"
import { EventFiltersBar } from "src/components/filters/event-filters-bar"
import { Layout } from "src/components/layout"
import { EventFilters, EventFiltersSchema } from "src/services/event.schema"
import { eventQueries, tagQueries, countryQueries } from "src/services/queries"

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => preloadQueries(context),
  component: Home,
  validateSearch: EventFiltersSchema,
})

const skeletons = Array.from({ length: 3 })

function Home() {
  const [filters, setFilters] = React.useState<EventFilters>({})

  return (
    <Layout>
      <div className="mb-9 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          Tech Events & Conferences
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover the best tech conferences, meetups, and workshops happening
          around the world.
        </p>
      </div>
      <div className="flex flex-col gap-6 w-full">
        <ErrorBoundary
          fallbackRender={(props) => <ErrorComponent error={props.error} />}
        >
          <EventFiltersBar filters={filters} onSetFilters={setFilters} />
        </ErrorBoundary>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
    </Layout>
  )
}

async function preloadQueries(context: any) {
  await Promise.all([
    context.queryClient.ensureQueryData(tagQueries.list()),
    context.queryClient.ensureQueryData(countryQueries.list()),
    context.queryClient.ensureQueryData(
      eventQueries.list(EventFiltersSchema.parse({})),
    ),
  ])
}
