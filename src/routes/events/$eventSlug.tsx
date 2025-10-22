import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import {
  createFileRoute,
  Link,
  useCanGoBack,
  useRouter,
} from "@tanstack/react-router"
import { isAfter } from "date-fns"
import { CalendarDays, ExternalLink, MapPin, Tag } from "lucide-react"
import { AddToCalendar } from "src/components/event/add-to-calendar"
import { Layout } from "src/components/layout"
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar"
import { Badge } from "src/components/ui/badge"
import { Button } from "src/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "src/components/ui/card"
import { formatDate } from "src/lib/date"
import { getEventModeConfig } from "src/lib/event-modes"
import { communityQueries, eventQueries } from "src/services/queries"
import { EventComments } from "~/components/event/comments"
import { EventCountdown } from "~/components/event/event-countdown"
import { EventRsvp } from "~/components/event/rsvp"
import { SimilarEvents } from "~/components/event/similar-events"
import { seo } from "~/lib/seo"

export const Route = createFileRoute("/events/$eventSlug")({
  loader: async ({ params, context }) => {
    const event = await context.queryClient.ensureQueryData(
      eventQueries.detailBySlug(params.eventSlug),
    )

    if (event.communityId) {
      await context.queryClient.ensureQueryData(
        communityQueries.detail(event.communityId),
      )
    }

    return event
  },
  head: ({ loaderData }) => ({
    meta: seo({
      title: loaderData?.name ?? "Event",
      description: loaderData?.description ?? "Event details on ConfHub",
      keywords:
        "event, conference" +
        (loaderData?.tags ? `, ${loaderData.tags.join(", ")}` : ""),
    }),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const { eventSlug } = Route.useParams()
  const { data: event } = useSuspenseQuery(eventQueries.detailBySlug(eventSlug))

  const { data: community } = useQuery({
    ...communityQueries.detail(event.communityId!),
    enabled: !!event.communityId,
  })

  const modeConfig = event.mode ? getEventModeConfig(event.mode) : null

  const canGoBack = useCanGoBack()

  return (
    <Layout className="items-center gap-6 max-w-5xl mx-auto py-8 w-full">
      {/* Header */}
      <div className="w-full">
        <Button
          variant="ghost"
          size="sm"
          className="mb-3"
          onClick={() =>
            canGoBack && router.history.length > 1
              ? router.history.back()
              : router.navigate({ to: "/" })
          }
        >
          ← Back
        </Button>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{event.name}</h1>
            {event.date && (
              <div className="flex">
                <EventCountdown eventDate={event.date} />
              </div>
            )}
          </div>
          <div className="flex gap-2 sm:mt-0 mt-2">
            {isAfter(event.date, new Date()) && (
              <AddToCalendar
                summary={event.name}
                description={event.description}
                url={event.eventUrl}
                location={[event.city, event.country]
                  .filter(Boolean)
                  .join(", ")}
                start={event.date}
                end={event.dateEnd ?? undefined}
                triggerLabel="Add to calendar"
                buttonVariant="secondary"
              />
            )}
            {event.cfpUrl && (
              <Button asChild variant="outline">
                <a
                  href={event.cfpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View CFP
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
            {event.eventUrl && (
              <Button asChild>
                <a
                  href={event.eventUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit website
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="grid w-full gap-6 md:grid-cols-3">
        {/* Main content */}
        <div className="md:col-span-2 flex flex-col gap-6 order-2 md:order-1">
          {event.description && (
            <Card>
              <CardHeader>
                <CardTitle>About this event</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap leading-7 text-muted-foreground">
                  {event.description}
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Comments</CardTitle>
            </CardHeader>
            <CardContent>
              <EventComments eventId={event.id} />
            </CardContent>
          </Card>

          <SimilarEvents
            eventId={event.id}
            currentEventTags={event.tags || []}
          />
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6 order-1 md:order-2">
          <Card>
            <CardHeader>
              <CardTitle>Event info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {event.date && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  <span>
                    {formatDate(new Date(event.date))}
                    {event.dateEnd && (
                      <> - {formatDate(new Date(event.dateEnd))}</>
                    )}
                  </span>
                </div>
              )}
              {event.city && event.country && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {event.city}, {event.country}
                  </span>
                </div>
              )}
              {modeConfig && (
                <div>
                  <Badge
                    variant="secondary"
                    className="inline-flex items-center gap-2"
                  >
                    <modeConfig.icon className="h-3 w-3" /> {modeConfig.label}
                  </Badge>
                </div>
              )}
              {event.eventUrl && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ExternalLink className="h-4 w-4" />
                  <a
                    href={event.eventUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Visit website
                  </a>
                </div>
              )}
              {event.cfpUrl && (
                <div className="pt-2 space-y-1">
                  <a
                    href={event.cfpUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Call for Papers
                  </a>
                  {event.cfpClosingDate && (
                    <div className="flex items-center gap-2">
                      <span
                        className={`${new Date(event.cfpClosingDate) < new Date() ? "text-red-500" : "text-green-600"}`}
                      >
                        closes {formatDate(new Date(event.cfpClosingDate))}
                      </span>
                      {isAfter(new Date(event.cfpClosingDate), new Date()) && (
                        <AddToCalendar
                          summary={`CFP deadline: ${event.name}`}
                          description={event.description}
                          url={event.cfpUrl ?? event.eventUrl}
                          location={[event.city, event.country]
                            .filter(Boolean)
                            .join(", ")}
                          start={event.cfpClosingDate}
                          alarmDaysBefore={7}
                          triggerLabel="Add to calendar"
                          buttonVariant="secondary"
                          buttonSize="xs"
                        />
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {community && (
            <Card>
              <CardHeader>
                <CardTitle>Hosted by</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={community.logoUrl || ""}
                      alt={community.name}
                    />
                    <AvatarFallback>
                      {community.name?.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <Link
                      to="/communities/$communitySlug"
                      params={{ communitySlug: community.slug }}
                      className="text-primary hover:underline font-medium"
                    >
                      {community.name}
                    </Link>
                    {community.homeUrl && (
                      <a
                        href={community.homeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-muted-foreground hover:underline"
                      >
                        {community.homeUrl}
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {event.id != null && <EventRsvp eventId={event.id} />}

          {event.tags && event.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-4 w-4" /> Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((t: string) => (
                    <Badge key={t} variant="outline" className="capitalize">
                      {t}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  )
}
