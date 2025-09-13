import { useMutation } from "@tanstack/react-query"
import { Link, useRouter } from "@tanstack/react-router"
import { Send, X } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import type { EventFilters } from "src/services/event.schema"
import { badgeVariants } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { useNaturalQueryHistory } from "~/hooks/useNaturalQueryHistory"
import { useAuthentication } from "~/lib/auth/client"
import { generateFiltersSchema } from "~/services/ai.api"

type Props = {
  onApplyFilters: (newFilters: EventFilters) => void
  className?: string
}

export function NaturalLanguageFilter({
  onApplyFilters,

  className,
}: Props) {
  const router = useRouter()
  const { isAuthenticated } = useAuthentication()
  const [naturalQuery, setNaturalQuery] = useState("")
  const queryInput = naturalQuery.trim()

  const { history, add, remove } = useNaturalQueryHistory()

  const { mutate, isPending } = useMutation({
    mutationFn: generateFiltersSchema,
    meta: { disableGlobalErrorHandling: true },
    onSuccess: (aiFilters, variables: { data: string }) => {
      if (!aiFilters) return

      onApplyFilters(aiFilters)

      const usedQuery = variables?.data ?? queryInput
      add({ query: usedQuery, filters: aiFilters })
    },
    onError: (error) => {
      if (error.message) {
        toast.error(error.message)
      } else {
        toast.error(
          "Failed to generate filters from natural language input. Please try again.",
        )
      }
      console.error("Error generating filters from natural query:", error)
    },
  })

  const onSendNaturalQuery = () => {
    if (!isAuthenticated || !queryInput || isPending) return
    mutate({ data: queryInput })
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
        {isAuthenticated && history.length > 0 && (
          <div className="flex flex-wrap gap-2" aria-label="Last requests">
            {history.slice(0, 5).map((item, idx) => {
              const text =
                item.query.length > 80
                  ? `${item.query.slice(0, 80)}…`
                  : item.query
              return (
                <div
                  key={`${item.timestamp}-${idx}`}
                  title={item.query}
                  role="button"
                  tabIndex={0}
                  className={`${badgeVariants({ variant: "secondary" })} cursor-pointer inline-flex items-center gap-1`}
                  onClick={() => {
                    // Apply stored filters without calling AI again
                    onApplyFilters(item.filters)
                    setNaturalQuery(item.query)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      // Apply stored filters without calling AI again
                      onApplyFilters(item.filters)
                      setNaturalQuery(item.query)
                    }
                  }}
                >
                  <span>{text || "(empty)"}</span>
                  <button
                    type="button"
                    aria-label="Remove saved query"
                    className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded hover:bg-secondary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      remove(item.query)
                    }}
                  >
                    <X className="h-3 w-3" aria-hidden="true" />
                  </button>
                </div>
              )
            })}
          </div>
        )}
        {isAuthenticated ? (
          <p id="nl-filter-hint" className="text-xs text-muted-foreground">
            This feature is experimental and rate limited to 5 requests per
            minute, 15 per day
            <span className="sr-only">
              Enter a natural language description of the events you want to
              find
            </span>
          </p>
        ) : (
          <p id="nl-filter-hint" className="text-xs text-muted-foreground">
            This feature is only available for logged-in users.{" "}
            <Link
              to="/sign-in"
              className="text-primary hover:underline"
              search={{ redirectTo: router.state.location.href }}
            >
              Sign in
            </Link>{" "}
            to use the natural language filter.
          </p>
        )}
      </div>
    </div>
  )
}
