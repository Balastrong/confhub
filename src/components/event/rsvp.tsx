import { Check, Clock, X } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import {
  rsvpQueries,
  useRemoveRsvpMutation,
  useUpsertRsvpMutation,
} from "~/services/queries"
import { SignedIn } from "~/components/auth/signed-in"
import { SignedOut } from "~/components/auth/signed-out"
import { toast } from "sonner"
import { Skeleton } from "~/components/ui/skeleton"

export function EventRsvp({ eventId }: { eventId: number }) {
  const { data: myRsvp } = useQuery(rsvpQueries.myRsvp(eventId))
  const { data: counts } = useQuery(rsvpQueries.counts(eventId))
  const upsertMut = useUpsertRsvpMutation(eventId)
  const removeMut = useRemoveRsvpMutation(eventId)

  const current = myRsvp?.status

  const setStatus = (next: "going" | "interested" | "not_going") => {
    if (current === next) {
      removeMut.mutate({ data: { eventId } })
      toast.success("RSVP cleared")
    } else {
      upsertMut.mutate({ data: { eventId, status: next } })
      toast.success(`RSVP set to ${next.replace("_", " ")}`)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your RSVP</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <SignedOut>
          <p className="text-sm text-muted-foreground">
            Sign in to RSVP to this event.
          </p>
        </SignedOut>
        <SignedIn>
          <div className="flex flex-col gap-2">
            <Button
              aria-pressed={current === "going"}
              variant={current === "going" ? "default" : "outline"}
              onClick={() => setStatus("going")}
              disabled={upsertMut.isPending}
              size="xs"
              className="w-full"
            >
              <Check className="mr-1.5 h-3 w-3" /> Going
              {counts?.going != null ? (
                <span className="ml-1 inline-flex items-center justify-center rounded-full bg-background/60 px-1.5 py-0 text-[10px] leading-4">
                  {counts.going}
                </span>
              ) : (
                <Skeleton className="ml-1 h-4 w-4 rounded-full" />
              )}
            </Button>
            <Button
              aria-pressed={current === "interested"}
              variant={current === "interested" ? "default" : "outline"}
              onClick={() => setStatus("interested")}
              disabled={upsertMut.isPending}
              size="xs"
              className="w-full"
            >
              <Clock className="mr-1.5 h-3 w-3" /> Interested
              {counts?.interested != null ? (
                <span className="ml-1 inline-flex items-center justify-center rounded-full bg-background/60 px-1.5 py-0 text-[10px] leading-4">
                  {counts.interested}
                </span>
              ) : (
                <Skeleton className="ml-1 h-4 w-4 rounded-full" />
              )}
            </Button>
            <Button
              aria-pressed={current === "not_going"}
              variant={current === "not_going" ? "default" : "outline"}
              onClick={() => setStatus("not_going")}
              disabled={upsertMut.isPending}
              size="xs"
              className="w-full"
            >
              <X className="mr-1.5 h-3 w-3" /> Not going
              {counts?.not_going != null ? (
                <span className="ml-1 inline-flex items-center justify-center rounded-full bg-background/60 px-1.5 py-0 text-[10px] leading-4">
                  {counts.not_going}
                </span>
              ) : (
                <Skeleton className="ml-1 h-4 w-4 rounded-full" />
              )}
            </Button>
          </div>
        </SignedIn>
      </CardContent>
    </Card>
  )
}
