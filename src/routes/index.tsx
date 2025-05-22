import { ErrorComponent, useNavigate } from "@tanstack/react-router"
import React from "react"
import { ErrorBoundary } from "react-error-boundary"
import { EventCardSkeleton } from "src/components/event/event-card-skeleton"
import { EventsList } from "src/components/event/events-list"
import { EventFiltersBar } from "src/components/filters/event-filters-bar"
import { Layout } from "src/components/layout"
import { EventFilters, EventFiltersSchema } from "src/services/event.schema"
import { tagQueries } from "src/services/queries"

export const Route = createFileRoute({
  beforeLoad: ({ context }) => {
    context.queryClient.ensureQueryData(tagQueries.list())
  },
  component: Home,
  validateSearch: EventFiltersSchema,
})

const skeletons = Array.from({ length: 2 })

function Home() {
  const filters = Route.useSearch()

  const navigate = useNavigate()
  const setFilters = (newFilters: EventFilters) => {
    navigate({ from: Route.fullPath, search: newFilters })
  }

  return (
    <Layout>
      <div className="mb-9 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          Tech Events & Conferences
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover the best tech conferences, meetups, and workshops happening
          around the world.
        </p>
      </div>
      <div className="flex flex-col gap-4 w-full">
        <ErrorBoundary
          fallbackRender={(props) => <ErrorComponent error={props.error} />}
        >
          <EventFiltersBar filters={filters} onSetFilters={setFilters} />
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
    </Layout>
  )
}
