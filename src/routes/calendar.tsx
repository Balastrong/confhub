import { useQuery } from "@tanstack/react-query"
import {
  getRouteApi,
  useNavigate,
  createFileRoute,
} from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { z } from "zod"
import { EventsCalendar } from "src/components/events-calendar"
import { Layout } from "src/components/layout"
import { formatDate } from "src/lib/date"
import { getFirstAndLast } from "src/lib/utils"
import { eventQueries } from "src/services/queries"
import { seo } from "~/lib/seo"

export const Route = createFileRoute("/calendar")({
  validateSearch: z.object({
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
  const { date } = Route.useSearch()
  const currentDate = new Date(date || Date.now())
  const setCurrentDate = (date: Date) => {
    navigate({ from: Route.fullPath, search: { date: formatDate(date) } })
  }

  const { firstSunday, lastSaturday } = useMemo(
    () =>
      getFirstAndLast(currentDate.getFullYear(), currentDate.getMonth() + 1),
    [currentDate],
  )

  const { data: events, isLoading } = useQuery({
    ...eventQueries.list({
      startDate: formatDate(firstSunday),
      endDate: formatDate(lastSaturday),
    }),
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
      <EventsCalendar
        events={events ?? []}
        currentDate={currentDate}
        onCurrentDateChange={setCurrentDate}
        isLoading={isLoading}
      />
    </Layout>
  )
}
