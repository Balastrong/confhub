import { useState } from "react"
import { Send, X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { generateFiltersSchema } from "~/services/ai.api"
import type { EventFilters } from "src/services/event.schema"

type Props = {
  onApplyFilters: (newFilters: EventFilters) => void
  onUpdateQuery?: (query: string) => void
  className?: string
}

export function NaturalLanguageFilter({
  onApplyFilters,
  onUpdateQuery,
  className,
}: Props) {
  const [naturalQuery, setNaturalQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const onSendNaturalQuery = async () => {
    const trimmed = naturalQuery.trim()
    if (!trimmed || isLoading) return

    try {
      setIsLoading(true)
      const aiFilters = await generateFiltersSchema({ data: trimmed })
      onApplyFilters(aiFilters)
      if (aiFilters.query && onUpdateQuery) {
        onUpdateQuery(aiFilters.query)
      }
    } catch (error) {
      toast.error(
        "Failed to generate filters from natural language input. Please try again.",
      )
      console.error("Error generating filters from natural query:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={className}>
      <div className="space-y-2">
        <div className="flex items-end justify-between">
          <Label htmlFor="nl-filter" className="font-medium">
            Natural language filter
          </Label>
          {naturalQuery && (
            <Button
              size="sm"
              variant="ghost"
              className="h-5 px-2 -mb-2"
              onClick={() => setNaturalQuery("")}
              aria-label="Clear natural language filter"
            >
              <X className="h-3 w-3" aria-hidden="true" />
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Input
            id="nl-filter"
            placeholder="Describe what you're looking for (e.g., 'React conferences in Europe next month')"
            value={naturalQuery}
            onChange={(event) => setNaturalQuery(event.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                onSendNaturalQuery()
              }
            }}
            className="w-full"
            aria-describedby="nl-filter-hint"
          />
          <Button
            type="button"
            className="h-10"
            onClick={onSendNaturalQuery}
            disabled={!naturalQuery.trim() || isLoading}
            aria-label="Send natural language filter"
            title="Send"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p id="nl-filter-hint" className="sr-only">
          Enter a natural language description of the events you want to find
        </p>
      </div>
    </div>
  )
}
