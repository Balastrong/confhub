import { getRouteApi } from "@tanstack/react-router"
import { formatDate } from "src/lib/date"
import { getEventModeConfig } from "src/lib/event-modes"
import { FullEvent } from "src/services/event.schema"
import { Badge } from "../ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"

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
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {event.city && event.country && (
              <span>{`${event.city}, ${event.country}`}</span>
            )}
            {event.mode && (
              <Badge
                variant="secondary"
                className="text-xs flex items-center gap-1"
              >
                {(() => {
                  const modeConfig = getEventModeConfig(event.mode)
                  const IconComponent = modeConfig.icon
                  return (
                    <>
                      <IconComponent className="h-3 w-3" />
                      {modeConfig.label}
                    </>
                  )
                })()}
              </Badge>
            )}
          </div>
        </div>
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
        <div className="flex flex-wrap gap-1">
          {event.tags?.map((tag) => (
            <Badge
              key={tag}
              variant={tags.includes(tag) ? "default" : "outline"}
              className="capitalize mb-1"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}
