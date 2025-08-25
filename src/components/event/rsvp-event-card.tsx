import type { RsvpStatus } from "src/services/event-rsvp.schema"
import type { FullEvent } from "src/services/event.schema"
import { Badge } from "../ui/badge"
import { EventCard } from "./event-card"

type Props = {
  event: FullEvent & { rsvpStatus: RsvpStatus }
}

export function RsvpEventCard({ event }: Props) {
  const rsvpStatus = event.rsvpStatus

  return (
    <div className="relative group">
      <EventCard event={event} />
      <div className="absolute top-3 right-3 transition duration-200 ease-out group-hover:-translate-y-0.5">
        <Badge
          variant={
            rsvpStatus === "going"
              ? "default"
              : rsvpStatus === "interested"
                ? "secondary"
                : "outline"
          }
          className="capitalize"
        >
          {rsvpStatus.replace("_", " ")}
        </Badge>
      </div>
    </div>
  )
}
