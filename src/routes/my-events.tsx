import { useSuspenseQuery } from "@tanstack/react-query"
import {
  createFileRoute,
  ErrorComponent,
  redirect,
} from "@tanstack/react-router"
import React from "react"
import { ErrorBoundary } from "react-error-boundary"
import { EventCardSkeleton } from "src/components/event/event-card-skeleton"
import { RsvpEventCard } from "src/components/event/rsvp-event-card"
import { Layout } from "src/components/layout"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "src/components/ui/card"
import { rsvpQueries } from "src/services/queries"
import { FullEvent } from "~/services/event.schema"

export const Route = createFileRoute("/my-events")({
  beforeLoad: ({ context }) => {
    if (!context.userSession) {
      throw redirect({ to: "/" })
    }

    context.queryClient.ensureQueryData(rsvpQueries.myEvents())
  },
  component: MyEvents,
})

const skeletons = Array.from({ length: 3 })

function MyEvents() {
  return (
    <Layout>
      <div className="mb-9 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          My Events
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          Events you've RSVP'd to
        </p>
      </div>

      <ErrorBoundary
        fallbackRender={(props) => <ErrorComponent error={props.error} />}
      >
        <React.Suspense
          fallback={
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {skeletons.map((_, index) => (
                <EventCardSkeleton key={index} />
              ))}
            </div>
          }
        >
          <MyEventsList />
        </React.Suspense>
      </ErrorBoundary>
    </Layout>
  )
}

function MyEventsList() {
  const { data } = useSuspenseQuery({
    ...rsvpQueries.myEvents(),
    select: (rsvpEvents) => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const upcomingRaw = rsvpEvents.filter((rsvpEvent) => {
        const eventDate = new Date(rsvpEvent.dateEnd || rsvpEvent.date)
        eventDate.setHours(0, 0, 0, 0)
        return eventDate >= today
      })

      const pastRaw = rsvpEvents.filter((rsvpEvent) => {
        const eventDate = new Date(rsvpEvent.dateEnd || rsvpEvent.date)
        eventDate.setHours(0, 0, 0, 0)
        return eventDate < today
      })

      const toEvent = (rsvpEvent: (typeof rsvpEvents)[number]): FullEvent => ({
        id: rsvpEvent.id,
        slug: rsvpEvent.slug,
        name: rsvpEvent.name,
        description: rsvpEvent.description,
        date: rsvpEvent.date,
        dateEnd: rsvpEvent.dateEnd,
        eventUrl: rsvpEvent.eventUrl,
        cfpUrl: rsvpEvent.cfpUrl,
        cfpClosingDate: rsvpEvent.cfpClosingDate,
        mode: rsvpEvent.mode,
        city: rsvpEvent.city,
        country: rsvpEvent.country,
        tags: rsvpEvent.tags || [],
        draft: rsvpEvent.draft,
        communityId: rsvpEvent.communityId,
      })

      const upcomingEvents = upcomingRaw.map((rsvpEvent) => ({
        ...toEvent(rsvpEvent),
        rsvpStatus: rsvpEvent.rsvpStatus,
      }))

      const pastEvents = pastRaw.map((rsvpEvent) => ({
        ...toEvent(rsvpEvent),
        rsvpStatus: rsvpEvent.rsvpStatus,
      }))

      return {
        upcomingEvents,
        pastEvents,
        total: rsvpEvents.length,
      }
    },
  })

  if (!data.total) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No events yet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            You haven't RSVP'd to any events yet. Browse events and RSVP to see
            them here!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-12">
      {/* Upcoming Events Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Upcoming Events</h2>
        {data.upcomingEvents.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {data.upcomingEvents.map((event) => (
              <RsvpEventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-6">
              <p className="text-muted-foreground">
                No upcoming events. Browse events and RSVP to see them here!
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Past Events Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Past Events</h2>
        {data.pastEvents.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {data.pastEvents.map((event) => (
              <RsvpEventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-6">
              <p className="text-muted-foreground">No past events yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
