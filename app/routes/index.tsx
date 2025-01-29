import {
  createFileRoute,
  ErrorComponent,
  useNavigate,
} from "@tanstack/react-router"
import React from "react"
import { ErrorBoundary } from "react-error-boundary"
import { z } from "zod"
import { EventCardSkeleton } from "~/components/event-card-skeleton"
import { EventsList } from "~/components/events-list"
import { EventFiltersBar } from "~/components/filters/event-filters-bar"
import { Layout } from "~/components/layout"
import { tagQueries } from "~/services/queries"
import { EventFiltersSchema, EventFilters } from "~/services/event.schema"

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    context.queryClient.ensureQueryData(tagQueries.list())
  },
  component: Home,
  validateSearch: EventFiltersSchema,
})

const skeletons = Array.from({ length: 2 })

function Home() {
  const navigate = useNavigate()
  const filters = Route.useSearch()

  const setFilters = (newFilters: EventFilters) => {
    navigate({ from: Route.fullPath, search: newFilters })
  }

  return (
    <Layout>
      <h1 className="text-2xl mb-4 text-center">Events</h1>
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
