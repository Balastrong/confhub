import { format } from "date-fns"

export const formatDateTime = (date: Date) => {
  return format(date, "yyyy-MM-dd HH:mm")
}

export const formatDate = (date: Date | string) => {
  return format(date, "yyyy-MM-dd")
}

export const getEventCountdown = (eventDate: string | Date): {
  text: string
  variant: "default" | "warning" | "past" | "today"
} => {
  const now = new Date()
  const event = new Date(eventDate)
  const diffInMs = event.getTime() - now.getTime()
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24))

  // Event has passed
  if (diffInMs < 0) {
    return {
      text: "Event ended",
      variant: "past"
    }
  }

  // Event is today
  if (diffInDays === 0) {
    const diffInHours = Math.ceil(diffInMs / (1000 * 60 * 60))
    if (diffInHours <= 0) {
      return {
        text: "Happening now",
        variant: "today"
      }
    } else if (diffInHours === 1) {
      return {
        text: "Starts in 1 hour",
        variant: "today"
      }
    } else {
      return {
        text: `Starts in ${diffInHours} hours`,
        variant: "today"
      }
    }
  }

  // Event is tomorrow
  if (diffInDays === 1) {
    return {
      text: "Starts tomorrow",
      variant: "warning"
    }
  }

  // Event is within a week
  if (diffInDays <= 7) {
    return {
      text: `Starts in ${diffInDays} days`,
      variant: "warning"
    }
  }

  // Event is further away
  return {
    text: `Starts in ${diffInDays} days`,
    variant: "default"
  }
}
