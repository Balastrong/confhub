import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router"
import { PlusCircle, Users } from "lucide-react"
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
  DialogTrigger,
  DialogTitle,
} from "../../components/ui/dialog"
import { seo } from "~/lib/seo"

export const Route = createFileRoute("/communities/$communitySlug")({
  loader: async ({ params, context }) => {
    const community = await context.queryClient.ensureQueryData(
      communityQueries.detailBySlug(params.communitySlug),
    )

    context.queryClient.ensureQueryData(
      eventQueries.list({ communityId: community.id }),
    )

    return community
  },
  head: ({ loaderData }) => ({
    meta: seo({
      title: loaderData?.name ?? "Community",
      description: (loaderData?.description ?? "Community") + " on ConfHub",
      type: "profile",
    }),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuthentication()
  const { communitySlug } = Route.useParams()
  const { data: community } = useSuspenseQuery(
    communityQueries.detailBySlug(communitySlug),
  )
  const navigate = useNavigate()
  const router = useRouter()
  const [showLeaveDialog, setShowLeaveDialog] = useState(false)

  const eventsQuery = useSuspenseQuery(
    eventQueries.list({ communityId: community.id }),
  )

  const joinMutation = useMutation({
    mutationFn: joinCommunity,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: communityQueries.all })
      router.invalidate()
      toast.success(`You're now a member of ${community.name}`)
    },
  })

  const leaveMutation = useMutation({
    mutationFn: leaveCommunity,
    onSuccess: async (r) => {
      await queryClient.invalidateQueries({ queryKey: communityQueries.all })
      router.invalidate()
      setShowLeaveDialog(false)
      toast.success(`You're no longer part of ${community.name}`)
    },
  })

  const handleJoin = (communityId: number) => {
    if (!isAuthenticated) {
      toast.error("You need to be logged in to join a community.", {
        action: {
          label: "Sign in",
          onClick: () => {
            navigate({
              to: "/sign-in",
              search: { redirectTo: router.state.location.href },
            })
          },
        },
      })
      return
    }

    joinMutation.mutate({ data: { communityId } })
  }

  const handleLeave = () => {
    setShowLeaveDialog(true)
  }

  const confirmLeave = () => {
    leaveMutation.mutate({ data: { communityId: community.id } })
  }

  const isAdmin = community.userRole === "admin"
  const isMember = community.isMember

  return (
    <Layout className="items-center gap-6 max-w-4xl mx-auto py-8 w-full">
      <div className="w-full bg-muted/50 p-8 rounded-lg">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {community.logoUrl && (
            <img
              src={community.logoUrl}
              alt={`${community.name} logo`}
              className="size-28 rounded-lg object-cover shadow-md"
            />
          )}
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-bold">{community.name}</h1>
              {community.verified ? (
                <Badge variant="accent">✓ Verified</Badge>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="xs" variant="outline">
                      Claim
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Claim Community</DialogTitle>
                      <DialogDescription className="flex flex-col gap-2">
                        <p>
                          Some communities have been manually created with
                          publicly available data to group the events.
                        </p>
                        <p>
                          Is this your community? Please DM me on{" "}
                          <a
                            href="https://www.linkedin.com/in/leonardo-montini/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            LinkedIn
                          </a>{" "}
                          or{" "}
                          <a
                            href="https://x.com/Balastrong"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Twitter
                          </a>{" "}
                          to claim it!
                        </p>
                        <p>
                          You'll be able to edit Community details and (soon™)
                          manage your own events.
                        </p>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            <p className="text-muted-foreground text-base">
              {community.description}
            </p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="size-4" />
              <span>{community.memberCount} members</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-6">
          {isAuthenticated && (
            <>
              {isMember ? (
                <Button
                  variant="destructive"
                  onClick={() => handleLeave()}
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
              {isAdmin && (
                <Button
                  onClick={() =>
                    navigate({
                      to: "/events/submit",
                      search: { communityId: community.id },
                    })
                  }
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Event
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      <Card className="w-full p-6">
        <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
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
                          to: "/events/pro/$eventId",
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
                    search: { communityId: community.id },
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
            <EditCommunityForm communityId={community.id} />
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
