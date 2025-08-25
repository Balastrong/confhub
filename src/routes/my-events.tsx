import {
  createFileRoute,
  ErrorComponent,
  redirect,
} from "@tanstack/react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import React from "react"
import { ErrorBoundary } from "react-error-boundary"
import { EventCard } from "src/components/event/event-card"
import { EventCardSkeleton } from "src/components/event/event-card-skeleton"
import { Layout } from "src/components/layout"
import { Badge } from "src/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "src/components/ui/card"
import { rsvpQueries } from "src/services/queries"

export const Route = createFileRoute("/my-events")({
  beforeLoad: ({ context }) => {
    // Ensure user is logged in - this will redirect if not
    if (!context.userSession) {
      throw redirect({ to: "/" })
    }

    // Pre-load the user's RSVP events
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
  const { data: rsvpEvents } = useSuspenseQuery(rsvpQueries.myEvents())

  if (!rsvpEvents.length) {
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

  // Separate events into upcoming and past
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Set to start of day for comparison

  const upcomingEvents = rsvpEvents.filter((rsvpEvent) => {
    const eventDate = new Date(rsvpEvent.dateEnd || rsvpEvent.date)
    eventDate.setHours(0, 0, 0, 0)
    return eventDate >= today
  })

  const pastEvents = rsvpEvents.filter((rsvpEvent) => {
    const eventDate = new Date(rsvpEvent.dateEnd || rsvpEvent.date)
    eventDate.setHours(0, 0, 0, 0)
    return eventDate < today
  })

  const renderEventCard = (rsvpEvent: typeof rsvpEvents[0]) => {
    const event = {
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
    }

    return (
      <div key={rsvpEvent.id} className="relative">
        <EventCard event={event} />
        {/* Add RSVP status badge */}
        <div className="absolute top-3 right-3">
          <Badge
            variant={
              rsvpEvent.rsvpStatus === "going"
                ? "default"
                : rsvpEvent.rsvpStatus === "interested"
                  ? "secondary"
                  : "outline"
            }
            className="capitalize"
          >
            {rsvpEvent.rsvpStatus.replace("_", " ")}
          </Badge>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* Upcoming Events Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Upcoming Events</h2>
        {upcomingEvents.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map(renderEventCard)}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
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
        {pastEvents.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {pastEvents.map(renderEventCard)}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">
                No past events yet.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
