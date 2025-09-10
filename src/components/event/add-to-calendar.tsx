import { CalendarPlus, ExternalLink, Calendar, Download } from "lucide-react"
import { useMemo } from "react"
import { addDays, isValid, parseISO } from "date-fns"
import { Button } from "src/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "src/components/ui/dialog"
import { EventCountdown } from "src/components/event/event-countdown"

type AddToCalendarProps = {
  summary: string
  description?: string | null
  url?: string | null
  location?: string | null
  // All-day date in ISO (YYYY-MM-DD) or full ISO. If end is omitted, all-day single day.
  start: string
  end?: string | null
  // Add an optional alarm N days before (all-day). Use positive integer days.
  alarmDaysBefore?: number
  triggerLabel?: string
  buttonSize?: "xs" | "sm" | "default" | "lg"
  buttonVariant?: "secondary" | "default" | "outline" | "ghost" | "accent"
}

function toYMD(input: string | Date) {
  // Supports YYYY-MM-DD or full ISO or Date; returns YYYYMMDD
  // If the input is a pure date (all-day), avoid TZ drift by using it verbatim.
  if (typeof input === "string" && /^\d{4}-\d{2}-\d{2}$/.test(input)) {
    return input.replace(/-/g, "")
  }
  const d = typeof input === "string" ? parseISO(input) : input
  if (!isValid(d)) return ""
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, "0")
  const day = String(d.getUTCDate()).padStart(2, "0")
  return `${y}${m}${day}`
}

export function AddToCalendar({
  summary,
  description,
  url,
  location,
  start,
  end,
  alarmDaysBefore,
  triggerLabel = "Add to calendar",
  buttonSize = "default",
  buttonVariant = "secondary",
}: AddToCalendarProps) {
  const ymdStart = toYMD(start)
  // If end is omitted, compute all-day exclusive end as start + 1 day (avoid TZ drift for pure dates)
  let computedEnd: string | Date

  if (!end && typeof start === "string" && /^\d{4}-\d{2}-\d{2}$/.test(start)) {
    const [y, m, d] = start.split("-").map((n) => parseInt(n, 10))
    const utcDate = new Date(Date.UTC(y, m - 1, d))
    computedEnd = addDays(utcDate, 1)
  } else {
    computedEnd = end ?? addDays(parseISO(start), 1)
  }
  const ymdEnd = toYMD(computedEnd)

  const detailsJoined = useMemo(() => {
    return [
      description ?? undefined,
      url ? `Home: ${url}` : undefined,
      "\n___\nAdded through ConfHub: https://confhub.tech/",
    ]
      .filter(Boolean)
      .join("\n")
  }, [description, url])

  const googleHref = useMemo(() => {
    const u = new URL("https://calendar.google.com/calendar/render")
    u.searchParams.set("action", "TEMPLATE")
    u.searchParams.set("text", summary)
    if (ymdStart && ymdEnd) u.searchParams.set("dates", `${ymdStart}/${ymdEnd}`)
    if (detailsJoined) u.searchParams.set("details", detailsJoined)
    if (location) u.searchParams.set("location", location)
    return u.toString()
  }, [summary, ymdStart, ymdEnd, detailsJoined, location])

  const icsHref = useMemo(() => {
    const nowIso = new Date()
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z$/, "Z")
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//ConfHub//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `DTSTAMP:${nowIso}`,
      `UID:${cryptoRandomUID()}`,
      `DTSTART;VALUE=DATE:${ymdStart}`,
      `DTEND;VALUE=DATE:${ymdEnd}`,
      `SUMMARY:${escapeICS(summary)}`,
      detailsJoined ? `DESCRIPTION:${escapeICS(detailsJoined)}` : undefined,
      location ? `LOCATION:${escapeICS(location)}` : undefined,
      ...(alarmDaysBefore && alarmDaysBefore > 0
        ? [
            "BEGIN:VALARM",
            "ACTION:DISPLAY",
            "DESCRIPTION:Reminder",
            `TRIGGER:-P${alarmDaysBefore}D`,
            "END:VALARM",
          ]
        : []),
      "END:VEVENT",
      "END:VCALENDAR",
    ].filter(Boolean)

    return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join("\r\n"))}`
  }, [ymdStart, ymdEnd, summary, detailsJoined, location, alarmDaysBefore])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={buttonSize} variant={buttonVariant}>
          {triggerLabel}
          <CalendarPlus className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to calendar</DialogTitle>
          <DialogDescription>
            Review and choose your preferred calendar option.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <EventCountdown eventDate={start} />
          <div>
            <div className="font-medium">{summary}</div>
            <div className="text-muted-foreground">
              {formatHuman(start, end)}
              {location ? ` • ${location}` : ""}
            </div>
            {description && (
              <p className="mt-2 whitespace-pre-wrap text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2 pt-2 max-w-80 mx-auto">
            <Button asChild size="sm">
              <a href={googleHref} target="_blank" rel="noopener noreferrer">
                Google Calendar
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button asChild size="sm" variant="outline">
              <a href={icsHref} download="event.ics">
                Outlook / Apple (ICS)
                <Calendar className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button asChild size="sm" variant="secondary">
              <a href={icsHref} download="event.ics">
                Download .ics
                <Download className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function formatHuman(start: string, end?: string | null) {
  try {
    const s = new Date(start)
    const e = end ? new Date(end) : undefined
    const sFmt = s.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    if (!e) return sFmt
    const eFmt = e.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    return `${sFmt} - ${eFmt}`
  } catch {
    return start
  }
}

function escapeICS(s: string) {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;")
}

function cryptoRandomUID() {
  // Best-effort UID; browsers with Web Crypto
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    // @ts-ignore
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}
