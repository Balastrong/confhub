import React, { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { FullEvent } from "~/services/event.schema"
import { getColorFromName } from "~/lib/utils"
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

// Add helper to format date consistently without timezone issues
const formatDate = (date: Date) =>
  `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`

type DatedFullEvent = FullEvent & {
  date: string
  dateEnd: string
}

type EventsCalendarProps = {
  events: DatedFullEvent[]
  currentDate: Date
  onCurrentDateChange: (date: Date) => void
}

export const EventsCalendar = ({
  events,
  onCurrentDateChange,
  currentDate,
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

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Button onClick={handlePrevMonth}>Prev</Button>
        <div className="text-lg font-bold">
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </div>
        <Button onClick={handleNextMonth}>Next</Button>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {DAYS.map((day) => (
          <div key={day} className="text-center font-semibold">
            {day}
          </div>
        ))}
        {generateCalendar().map((week, weekIndex) => {
          const { weekCells, numSlots } = scheduleWeekEvents(week)
          return week.map((cell, dayIndex) => (
            <div
              key={`${weekIndex}-${dayIndex}`}
              className={`border rounded-sm min-h-20 flex flex-col items-center justify-start p-1 relative ${
                cell.isCurrentMonth ? "" : "bg-gray-100"
              }`}
            >
              <span>{cell.date.getDate()}</span>
              <div className="flex flex-col gap-1 mt-1 w-full">
                {Array.from({ length: numSlots }).map((_, slotIndex) => {
                  const event = weekCells[dayIndex][slotIndex]
                  if (event) {
                    const cellDateStr = formatDate(cell.date)
                    const leftRounded = cellDateStr === event.date
                    const rightRounded = cellDateStr === event.dateEnd
                    return (
                      <div
                        key={slotIndex}
                        className={`w-full h-4 relative ${getColorFromName(event.name)} ${leftRounded ? "rounded-l-md" : ""} ${
                          rightRounded ? "rounded-r-md" : ""
                        }`}
                      >
                        <span className="absolute inset-0 flex items-center justify-center text-white text-xs">
                          {event.name}
                        </span>
                      </div>
                    )
                  }
                  return <div key={slotIndex} className="w-full h-4"></div>
                })}
              </div>
            </div>
          ))
        })}
      </div>
    </div>
  )
}
