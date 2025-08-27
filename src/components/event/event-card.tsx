import { Link } from "@tanstack/react-router"
import { ExternalLink } from "lucide-react"
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
  highlightedTags?: string[]
}

export const EventCard = ({ event, highlightedTags = [] }: Props) => {
  return (
    <Link
      to="/events/$eventSlug"
      params={{ eventSlug: event.slug }}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-xl"
    >
      <Card className="relative h-full flex flex-col rounded-xl border border-border/60 bg-card/95 transition-transform duration-300 ease-out hover:shadow-lg hover:-translate-y-1 hover:scale-[1.01] focus-visible:shadow-lg will-change-[transform,box-shadow] before:content-[''] before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-primary/10 before:to-transparent before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:pointer-events-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg sm:text-xl leading-snug transition-colors group-hover:text-foreground">
            {event.name}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-muted-foreground">
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
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              {event.city && event.country && (
                <span className="shrink-0">
                  {`${event.city}, ${event.country}`}
                </span>
              )}
              {event.mode && (
                <Badge
                  variant="secondary"
                  className="text-[10px] uppercase tracking-wide flex items-center gap-1 py-0.5 transition-colors group-hover:bg-muted"
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
                className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-muted/30 px-2 py-0.5 text-xs font-medium text-foreground/90 hover:bg-muted/60 hover:border-primary/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                data-analytics="event-cfp-link"
              >
                Call for Papers
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
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
                variant={highlightedTags.includes(tag) ? "default" : "outline"}
                className="capitalize mb-1 text-xs transition-colors group-hover:bg-muted/40"
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
