import { useQuery } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useMemo } from "react"
import { EventsCalendar } from "src/components/events-calendar"
import { Layout } from "src/components/layout"
import { formatDate } from "src/lib/date"
import { getFirstAndLast } from "src/lib/utils"
import { countryQueries, eventQueries, tagQueries } from "src/services/queries"
import { z } from "zod"
import { CalendarFiltersBar } from "~/components/filters/calendar-filters-bar"
import { seo } from "~/lib/seo"
import { EventFiltersSchema, type EventFilters } from "~/services/event.schema"

function getQueryKey(filters: EventFilters, date: string) {
  const currentDate = new Date(date || Date.now())

  const { firstSunday, lastSaturday } = getFirstAndLast(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
  )

  return {
    ...eventQueries.list({
      ...filters,
      startDate: formatDate(firstSunday),
      endDate: formatDate(lastSaturday),
      limit: 100,
    }),
  }
}

export const Route = createFileRoute("/calendar")({
  beforeLoad: async ({ context, search }) => {
    const { date, ...filters } = search
    await Promise.all([
      context.queryClient.ensureQueryData(tagQueries.list()),
      context.queryClient.ensureQueryData(countryQueries.list()),
      context.queryClient.ensureQueryData(getQueryKey(filters, date)),
    ])
  },
  validateSearch: EventFiltersSchema.extend({
    date: z.iso.date().catch(() => formatDate(new Date(new Date().setDate(1)))),
  }),
  head: () => ({
    meta: seo({
      title: "Calendar",
      description: "View your tech events on ConfHub",
    }),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { date, ...filters } = Route.useSearch()
  const currentDate = new Date(date || Date.now())
  const setCurrentDate = (date: Date) => {
    navigate({
      from: Route.fullPath,
      search: { ...filters, date: formatDate(date) },
    })
  }
  const setFilters = (newFilters: EventFilters) => {
    navigate({
      from: Route.fullPath,
      search: { ...newFilters, date: formatDate(currentDate) },
    })
  }

  const { data: events, isLoading } = useQuery({
    ...getQueryKey(filters, date),
    select: (data) =>
      data
        .filter((event) => event.date)
        .map((event) => ({
          ...event,
          date: event.date!,
          dateEnd: event.dateEnd ?? event.date!,
        })),
  })

  return (
    <Layout>
      <div className="mb-6">
        <CalendarFiltersBar filters={filters} onSetFilters={setFilters} />
      </div>
      <EventsCalendar
        events={events ?? []}
        currentDate={currentDate}
        onCurrentDateChange={setCurrentDate}
        isLoading={isLoading}
      />
    </Layout>
  )
}
