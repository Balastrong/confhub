import { useEffect, useState } from "react"
import { getEventCountdown } from "~/lib/date"

export const useEventCountdown = (eventDate: string | Date) => {
  const [countdown, setCountdown] = useState(() => getEventCountdown(eventDate))

  useEffect(() => {
    // Update immediately
    setCountdown(getEventCountdown(eventDate))

    // Set up interval to update every minute
    const interval = setInterval(() => {
      setCountdown(getEventCountdown(eventDate))
    }, 60 * 1000) // Update every minute

    return () => clearInterval(interval)
  }, [eventDate])

  return countdown
}