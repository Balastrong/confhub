import { getRouteApi, Link } from "@tanstack/react-router"
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
    <Link
      to="/events/$eventSlug"
      params={{ eventSlug: event.slug }}
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-lg"
    >
      <Card className="h-full flex flex-col transition duration-200 ease-out hover:bg-card/60 hover:shadow-md hover:-translate-y-0.5 focus-visible:shadow-md will-change-transform rounded-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg sm:text-xl leading-snug">
            {event.name}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            {event.date ? (
              <>
                {formatDate(new Date(event.date))}
                {event.dateEnd && " - "}
                {event.dateEnd ? formatDate(new Date(event.dateEnd)) : null}
              </>
            ) : null}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pt-0 pb-3">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              {event.city && event.country && (
                <span className="shrink-0">
                  {`${event.city}, ${event.country}`}
                </span>
              )}
              {event.mode && (
                <Badge
                  variant="secondary"
                  className="text-[10px] uppercase tracking-wide flex items-center gap-1 py-0.5"
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
            <p className="mt-2 text-sm">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  window.open(event.cfpUrl!, "_blank", "noopener,noreferrer")
                }}
                aria-label={`Open call for papers page${
                  event.cfpClosingDate
                    ? ` (closes on ${event.cfpClosingDate})`
                    : ""
                }`}
                title={`Call for Papers${
                  event.cfpClosingDate
                    ? ` – closes ${event.cfpClosingDate}`
                    : ""
                }`}
                className="text-blue-500 hover:underline underline-offset-2 p-0 m-0 bg-transparent border-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400 rounded"
                data-analytics="event-cfp-link"
              >
                Call for Paper{" "}
                {event.cfpClosingDate ? (
                  <span
                    className={
                      new Date(event.cfpClosingDate) < new Date()
                        ? "text-red-500"
                        : "text-green-600"
                    }
                  >
                    ({event.cfpClosingDate})
                  </span>
                ) : null}
              </button>
            </p>
          )}
        </CardContent>
        <CardFooter className="pt-0">
          <div className="flex flex-wrap gap-1">
            {event.tags?.map((tag) => (
              <Badge
                key={tag}
                variant={tags.includes(tag) ? "default" : "outline"}
                className="capitalize mb-1 text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
