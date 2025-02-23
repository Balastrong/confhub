import { getRouteApi } from "@tanstack/react-router"
import { formatDate } from "~/lib/date"
import { FullEvent } from "~/services/event.schema"
import { Badge } from "./ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card"

type Props = {
  event: FullEvent
}

export const EventCard = ({ event }: Props) => {
  const { tags = [] } = getRouteApi("/").useSearch()

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {event.eventUrl ? (
            <a
              href={event.eventUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {event.name}
            </a>
          ) : (
            event.name
          )}
        </CardTitle>
        <CardDescription>
          {event.date ? (
            <>
              {formatDate(new Date(event.date))}
              {event.dateEnd && " - "}
              {event.dateEnd ? formatDate(new Date(event.dateEnd)) : null}
            </>
          ) : null}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          {event.city && event.country && `${event.city}, ${event.country}`}
        </p>
        {event.cfpUrl && (
          <p>
            <a
              href={event.cfpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Call for Paper{" "}
              {event.cfpClosingDate ? (
                <span
                  className={
                    new Date(event.cfpClosingDate) < new Date()
                      ? "text-red-500"
                      : "text-green-500"
                  }
                >
                  ({event.cfpClosingDate})
                </span>
              ) : null}
            </a>
          </p>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex gap-1">
          {event.tags?.map((tag) => (
            <Badge
              key={tag.id}
              variant={tags.includes(tag.name) ? "default" : "outline"}
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}
