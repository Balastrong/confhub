import { Clock } from "lucide-react"
import { Badge } from "~/components/ui/badge"
import { useEventCountdown } from "~/hooks/useEventCountdown"

type Props = {
  eventDate: string | Date
  className?: string
}

export const EventCountdown = ({ eventDate, className = "" }: Props) => {
  const countdown = useEventCountdown(eventDate)

  const getVariantClass = () => {
    switch (countdown.variant) {
      case "today":
        return "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
      case "warning":
        return "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
      case "past":
        return "bg-gray-50 text-gray-600 border-gray-200"
      default:
        return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
    }
  }

  return (
    <Badge
      variant="outline"
      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 h-auto transition-colors ${getVariantClass()} ${className}`}
    >
      <Clock className="h-3 w-3 flex-shrink-0" />
      <span className="whitespace-nowrap">{countdown.text}</span>
    </Badge>
  )
}