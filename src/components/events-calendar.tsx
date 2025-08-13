import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Loader2,
  MapPin,
} from "lucide-react"
import { Link } from "@tanstack/react-router"
import { cn, getColorFromName } from "src/lib/utils"
import { FullEvent } from "src/services/event.schema"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card"
import { formatDate } from "~/lib/date"

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

type DatedFullEvent = FullEvent & {
  date: string
  dateEnd: string
}

type EventsCalendarProps = {
  events: DatedFullEvent[]
  currentDate: Date
  onCurrentDateChange: (date: Date) => void
  isLoading: boolean
}

export const EventsCalendar = ({
  events,
  onCurrentDateChange,
  currentDate,
  isLoading,
}: EventsCalendarProps) => {
  // Updated generateCalendar to include cells outside the month with a flag
  const generateCalendar = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDayOfMonth = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const weeks: { date: Date; isCurrentMonth: boolean }[][] = []
    let week: { date: Date; isCurrentMonth: boolean }[] = []
    // Fill first week with previous month's days if needed
    if (firstDayOfMonth > 0) {
      const prevMonth = month === 0 ? 11 : month - 1
      const prevYear = month === 0 ? year - 1 : year
      const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate()
      for (let i = 0; i < firstDayOfMonth; i++) {
        week.push({
          date: new Date(
            prevYear,
            prevMonth,
            daysInPrevMonth - firstDayOfMonth + 1 + i,
          ),
          isCurrentMonth: false,
        })
      }
    }
    // Add current month days
    for (let d = 1; d <= daysInMonth; d++) {
      week.push({ date: new Date(year, month, d), isCurrentMonth: true })
      if (week.length === 7) {
        weeks.push(week)
        week = []
      }
    }
    // Fill last week with next month's days if needed
    if (week.length > 0) {
      const nextMonth = month === 11 ? 0 : month + 1
      const nextYear = month === 11 ? year + 1 : year
      let d = 1
      while (week.length < 7) {
        week.push({
          date: new Date(nextYear, nextMonth, d++),
          isCurrentMonth: false,
        })
      }
      weeks.push(week)
    }
    return weeks
  }

  // New helper to get events for a given date
  const getEventsForDate = (date: Date) => {
    const formattedDate = formatDate(date)
    return events
      .filter((e) => formattedDate >= e.date && formattedDate <= e.dateEnd)
      .sort((a, b) => a.date.localeCompare(b.date))
  }

  // Updated scheduleWeekEvents to use cell.date from week cells
  const scheduleWeekEvents = (
    week: { date: Date; isCurrentMonth: boolean }[],
  ) => {
    const eventIntervals: {
      event: (typeof events)[number]
      start: number
      end: number
      key: string
    }[] = []
    week.forEach((cell, idx) => {
      const dayEvents = getEventsForDate(cell.date)
      dayEvents.forEach((e) => {
        const key = `${e.date}-${e.dateEnd}-${e.name}`
        const existing = eventIntervals.find((ev) => ev.key === key)
        if (existing) {
          existing.start = Math.min(existing.start, idx)
          existing.end = Math.max(existing.end, idx)
        } else {
          eventIntervals.push({ event: e, start: idx, end: idx, key })
        }
      })
    })
    eventIntervals.sort((a, b) => a.start - b.start)
    const slots: { end: number }[] = []
    const scheduled = eventIntervals.map((interval) => {
      let assigned = -1
      for (let i = 0; i < slots.length; i++) {
        if (interval.start > slots[i].end) {
          assigned = i
          slots[i].end = interval.end
          break
        }
      }
      if (assigned === -1) {
        assigned = slots.length
        slots.push({ end: interval.end })
      }
      return { ...interval, slot: assigned }
    })
    const numSlots = slots.length
    const weekCells: DatedFullEvent[][] = Array(week.length)
      .fill(null)
      .map(() => Array(numSlots).fill(null))
    scheduled.forEach((s) => {
      for (let col = s.start; col <= s.end; col++) {
        weekCells[col][s.slot] = s.event
      }
    })
    return { weekCells, numSlots }
  }

  // Navigate to previous month
  const handlePrevMonth = () => {
    onCurrentDateChange(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    )
  }

  // Navigate to next month
  const handleNextMonth = () => {
    onCurrentDateChange(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    )
  }

  // New helper to check if a date is today
  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  // Navigate to current month
  const goToToday = () => {
    onCurrentDateChange(new Date(new Date().setDate(1)))
  }

  // Count events that intersect the currently visible month
  const monthStart = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  )
  const monthEnd = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  )
  const monthStartStr = formatDate(monthStart)
  const monthEndStr = formatDate(monthEnd)
  const eventsInMonthCount = events.filter(
    (e) => e.date <= monthEndStr && e.dateEnd >= monthStartStr,
  ).length

  return (
    <div className="bg-card rounded-lg shadow-md p-4 border border-border">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-1">
          <Button
            onClick={handlePrevMonth}
            variant="outline"
            size="icon"
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleNextMonth}
            variant="outline"
            size="icon"
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-center">
          <h2 className="text-xl font-bold">
            {currentDate.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <p className="text-xs text-muted-foreground mt-1 h-4 flex items-center justify-center gap-1">
            {isLoading ? (
              <>
                <Loader2 className="size-3 animate-spin" /> loading events...
              </>
            ) : (
              <>
                {eventsInMonthCount}{" "}
                {eventsInMonthCount === 1 ? "event" : "events"} this month{" "}
                {eventsInMonthCount === 0 && (
                  <Link
                    to="/events/submit"
                    className="underline hover:text-primary"
                  >
                    (submit one)
                  </Link>
                )}
              </>
            )}
          </p>
        </div>

        <Button
          onClick={goToToday}
          variant="outline"
          size="sm"
          className="flex items-center gap-1 border-accent text-accent hover:bg-accent hover:text-accent-foreground"
        >
          <Calendar className="h-4 w-4 mr-1" />
          Today
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {DAYS.map((day) => (
          <div
            key={day}
            className="text-center font-medium text-muted-foreground text-sm py-2"
          >
            {day}
          </div>
        ))}

        {generateCalendar().map((week, weekIndex) => {
          const { weekCells, numSlots } = scheduleWeekEvents(week)
          return week.map((cell, dayIndex) => {
            const isCurrentDay = isToday(cell.date)

            return (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className={cn(
                  "group/calendar-day border rounded min-h-24 flex flex-col p-1 relative transition-colors",
                  cell.isCurrentMonth
                    ? "bg-card"
                    : "bg-muted text-muted-foreground",
                  isCurrentDay && "ring-2 ring-accent ring-offset-1",
                  "hover:bg-muted/50",
                )}
              >
                <span
                  className={cn(
                    "text-sm font-medium h-6 w-6 flex items-center justify-center rounded-full",
                    isCurrentDay && "bg-accent text-accent-foreground",
                  )}
                >
                  {cell.date.getDate()}
                </span>

                <div className="flex flex-col gap-1 mt-1 w-full">
                  {Array.from({ length: numSlots }).map((_, slotIndex) => {
                    const event = weekCells[dayIndex][slotIndex]
                    if (event) {
                      const cellDateStr = formatDate(cell.date)
                      const leftRounded = cellDateStr === event.date
                      const rightRounded = cellDateStr === event.dateEnd
                      return (
                        <HoverCard
                          key={slotIndex}
                          openDelay={100}
                          closeDelay={50}
                        >
                          <HoverCardTrigger asChild>
                            <div
                              className={cn(
                                "w-full h-5 relative overflow-hidden",
                                getColorFromName(event.name),
                                leftRounded ? "rounded-l-md" : "",
                                rightRounded ? "rounded-r-md" : "",
                                "shadow-xs hover:opacity-90 cursor-pointer",
                              )}
                            >
                              <span className="absolute inset-0 flex items-center justify-start text-white text-xs px-1 truncate">
                                {event.name}
                              </span>
                            </div>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80" side="top">
                            <div className="space-y-3">
                              <div>
                                <h4 className="text-sm font-semibold leading-none mb-2">
                                  {event.name}
                                </h4>
                                {event.description && (
                                  <p className="text-sm text-muted-foreground line-clamp-3">
                                    {event.description}
                                  </p>
                                )}
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span>
                                    {formatDate(event.date)}
                                    {event.dateEnd &&
                                      event.dateEnd !== event.date && (
                                        <span>
                                          {" "}
                                          - {formatDate(event.dateEnd)}
                                        </span>
                                      )}
                                  </span>
                                </div>

                                {(event.city || event.country) && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span>
                                      {event.city && event.country
                                        ? `${event.city}, ${event.country}`
                                        : event.city || event.country}
                                    </span>
                                  </div>
                                )}

                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {event.mode}
                                  </Badge>
                                  {event.cfpUrl && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      CFP Open
                                    </Badge>
                                  )}
                                </div>

                                {event.eventUrl && (
                                  <div className="pt-2">
                                    <a
                                      href={event.eventUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                      View Event
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      )
                    }
                    return <div key={slotIndex} className="w-full h-5"></div>
                  })}
                </div>

                <div className="absolute inset-x-1 bottom-1 z-10 opacity-0 translate-y-1 pointer-events-none transition-all duration-150 group-hover/calendar-day:opacity-100 group-hover/calendar-day:translate-y-0 group-hover/calendar-day:pointer-events-auto">
                  <Button
                    asChild
                    variant="ghost"
                    size="xs"
                    className="w-full h-5 py-0 px-1 text-[11px] justify-center border border-dashed border-accent bg-accent/5 text-accent-foreground hover:bg-accent/20"
                  >
                    <Link
                      to="/events/submit"
                      // search={{ date: formatDate(cell.date) }} // Prefill date on the full form
                    >
                      Add event
                    </Link>
                  </Button>
                </div>
              </div>
            )
          })
        })}
      </div>
    </div>
  )
}
