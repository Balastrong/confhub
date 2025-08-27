import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Send, X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { generateFiltersSchema } from "~/services/ai.api"
import type { EventFilters } from "src/services/event.schema"
import { ButtonLink } from "~/components/button-link"
import { useAuthentication } from "~/lib/auth/client"
import { Link } from "@tanstack/react-router"

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
  const { isAuthenticated } = useAuthentication()
  const [naturalQuery, setNaturalQuery] = useState("")
  const queryInput = naturalQuery.trim()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: generateFiltersSchema,
  })

  const onSendNaturalQuery = async () => {
    if (!isAuthenticated || !queryInput || isPending) return

    try {
      const aiFilters = await mutateAsync({ data: queryInput })
      if (!aiFilters) return

      onApplyFilters(aiFilters)
      if (aiFilters.query && onUpdateQuery) {
        onUpdateQuery(aiFilters.query)
      }
    } catch (error) {
      toast.error(
        "Failed to generate filters from natural language input. Please try again.",
      )
      console.error("Error generating filters from natural query:", error)
    }
  }

  return (
    <div className={className}>
      <div className="space-y-2">
        <div className="flex items-end justify-between">
          <Label htmlFor="nl-filter" className="font-medium">
            Natural language filter
          </Label>
        </div>
        <div className="flex gap-2">
          <div className="relative w-full">
            <Input
              id="nl-filter"
              placeholder={
                "Describe what you're looking for (e.g., 'React conferences in Italy next month')"
              }
              value={naturalQuery}
              onChange={(event) => setNaturalQuery(event.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  onSendNaturalQuery()
                }
              }}
              className="w-full pr-10"
              aria-describedby="nl-filter-hint"
              disabled={!isAuthenticated}
            />
            {naturalQuery && (
              <button
                type="button"
                className="absolute cursor-pointer inset-y-0 right-2 my-auto flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                onClick={() => setNaturalQuery("")}
                aria-label="Clear natural language filter"
                disabled={!isAuthenticated}
                title={!isAuthenticated ? "Sign in required" : "Clear"}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
          <Button
            type="button"
            className="h-10"
            onClick={onSendNaturalQuery}
            disabled={!isAuthenticated || !queryInput || isPending}
            aria-label="Send natural language filter"
            title={!isAuthenticated ? "Sign in required" : "Send"}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {isAuthenticated ? (
          <p id="nl-filter-hint" className="text-xs text-muted-foreground">
            This feature is experimental and rate limited to 5 requests per
            minute, 15 per day
            <p className="sr-only">
              Enter a natural language description of the events you want to
              find
            </p>
          </p>
        ) : (
          <p id="nl-filter-hint" className="text-xs text-muted-foreground">
            This feature is only available for logged-in users.{" "}
            <Link to="/sign-in" className="text-primary hover:underline">
              Sign in
            </Link>{" "}
            to use the natural language filter.
          </p>
        )}
      </div>
    </div>
  )
}
