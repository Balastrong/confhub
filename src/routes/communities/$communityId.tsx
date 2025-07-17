import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { PlusCircle } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { EditCommunityForm } from "src/components/community/edit-community-form"
import { EventManagementCard } from "src/components/event/event-management-card"
import { Layout } from "src/components/layout"
import { Badge } from "src/components/ui/badge"
import { Button } from "src/components/ui/button"
import { Card } from "src/components/ui/card"
import { Separator } from "src/components/ui/separator"
import { joinCommunity, leaveCommunity } from "src/services/community.api"
import { communityQueries, eventQueries } from "src/services/queries"
import { useAuthentication } from "~/lib/auth/client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"

export const Route = createFileRoute("/communities/$communityId")({
  loader: async ({ params, context }) => {
    await context.queryClient.ensureQueryData(
      communityQueries.detail(+params.communityId),
    )
  },
  component: RouteComponent,
})

function RouteComponent() {
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuthentication()
  const { communityId } = Route.useParams()
  const navigate = useNavigate()
  const [showLeaveDialog, setShowLeaveDialog] = useState(false)

  const { data: community } = useSuspenseQuery(
    communityQueries.detail(+communityId),
  )

  const eventsQuery = useSuspenseQuery(
    eventQueries.list({ communityId: +communityId }),
  )

  const joinMutation = useMutation({
    mutationFn: joinCommunity,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: communityQueries.all })
      toast.success(`You're now a member of ${community.name}`)
    },
  })

  const leaveMutation = useMutation({
    mutationFn: leaveCommunity,
    onSuccess: async (r) => {
      r
      await queryClient.invalidateQueries({ queryKey: communityQueries.all })
      setShowLeaveDialog(false)
      toast.success(`You're no longer part of ${community.name}`)
    },
  })

  const handleJoin = (communityId: number) => {
    if (!isAuthenticated) {
      toast.error("You need to be logged in to join a community.", {
        action: {
          label: "Sign in",
          onClick: () => navigate({ to: "/sign-in" }),
        },
      })
      return
    }

    joinMutation.mutate({ data: { communityId } })
  }

  const handleLeave = (communityId: number) => {
    setShowLeaveDialog(true)
  }

  const confirmLeave = () => {
    leaveMutation.mutate({ data: { communityId: community.id } })
  }

  const isAdmin = community.userRole === "admin"
  const isMember = community.isMember

  return (
    <Layout className="items-center gap-6 max-w-4xl mx-auto py-8 w-full">
      <div className="w-full flex flex-col sm:flex-row justify-between items-center bg-muted/50 p-6 rounded-lg">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{community.name}</h1>
            {community.verified && (
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-800 border-blue-200"
              >
                ✓ Verified
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-1">Community Management</p>
        </div>
        <div className="flex gap-2">
          {!isAdmin && isAuthenticated && (
            <>
              {isMember ? (
                <Button
                  variant="destructive"
                  onClick={() => handleLeave(community.id)}
                  disabled={leaveMutation.isPending}
                >
                  Leave Community
                </Button>
              ) : (
                <Button
                  onClick={() => handleJoin(community.id)}
                  disabled={joinMutation.isPending}
                >
                  Join Community
                </Button>
              )}
            </>
          )}
          {isAdmin && (
            <Button
              className="mt-4 sm:mt-0"
              onClick={() =>
                navigate({
                  to: "/events/submit",
                  search: { communityId: +communityId },
                })
              }
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              New Event
            </Button>
          )}
        </div>
      </div>

      <Card className="w-full p-6">
        <h2 className="text-xl font-semibold mb-4">Community Events</h2>
        <Separator className="mb-4" />

        {eventsQuery.data.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {eventsQuery.data.map((event) => (
              <EventManagementCard
                key={event.id}
                event={event}
                onEdit={
                  isAdmin
                    ? (event) => {
                        navigate({
                          to: "/events/$eventId",
                          params: { eventId: `${event.id}` },
                        })
                      }
                    : undefined
                }
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-muted-foreground mb-4">
              No events found for this community
            </p>
            {isAdmin && (
              <Button
                variant="outline"
                onClick={() =>
                  navigate({
                    to: "/events/submit",
                    search: { communityId: +communityId },
                  })
                }
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create your first event
              </Button>
            )}
          </div>
        )}
      </Card>

      {isAdmin && (
        <Card className="w-full p-6">
          <h2 className="text-xl font-semibold mb-4">Community Settings</h2>
          <Separator className="mb-6" />
          <div className="flex justify-center w-full">
            <EditCommunityForm communityId={+communityId} />
          </div>
        </Card>
      )}

      <Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave Community</DialogTitle>
            <DialogDescription>
              Are you sure you want to leave "{community.name}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLeaveDialog(false)}
              disabled={leaveMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmLeave}
              disabled={leaveMutation.isPending}
            >
              {leaveMutation.isPending ? "Leaving..." : "Leave Community"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  )
}
