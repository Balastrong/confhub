import { formatDate } from "src/lib/date"
import { FullEvent } from "src/services/event.schema"
import { Button } from "../ui/button"
import { PencilIcon } from "lucide-react"
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
  onEdit: (event: FullEvent) => void
}

export const EventManagementCard = ({ event, onEdit }: Props) => {
  return (
    <Card className="flex justify-between items-center p-4 gap-4">
      <div>
        <CardTitle className="text-lg">{event.name}</CardTitle>
        {event.date && (
          <CardDescription>
            {formatDate(new Date(event.date))}
            {event.dateEnd && " - "}
            {event.dateEnd ? formatDate(new Date(event.dateEnd)) : null}
          </CardDescription>
        )}
        {event.description && (
          <CardDescription className="line-clamp-2">
            {event.description}
          </CardDescription>
        )}
      </div>
      <Button variant="outline" size="icon" onClick={() => onEdit(event)}>
        <PencilIcon className="h-4 w-4" />
      </Button>
    </Card>
  )
}
