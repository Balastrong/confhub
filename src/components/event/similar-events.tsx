import { useQuery } from "@tanstack/react-query"
import { eventQueries } from "~/services/queries"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { EventCard } from "./event-card"

type Props = {
  eventId: number
  currentEventTags?: string[]
}

export const SimilarEvents = ({ eventId, currentEventTags = [] }: Props) => {
  const { data: similarEvents, isLoading } = useQuery(
    eventQueries.similar(eventId, 2),
  )

  if (isLoading) {
    return null
  }

  if (!similarEvents || similarEvents.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Similar events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {similarEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              highlightedTags={currentEventTags}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
