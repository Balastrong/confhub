import { useSuspenseQuery } from "@tanstack/react-query"
import { useNavigate, createFileRoute } from "@tanstack/react-router"
import { PlusCircle } from "lucide-react"
import { EditCommunityForm } from "src/components/community/edit-community-form"
import { EventManagementCard } from "src/components/event/event-management-card"
import { Layout } from "src/components/layout"
import { Button } from "src/components/ui/button"
import { Card } from "src/components/ui/card"
import { Badge } from "src/components/ui/badge"
import { Separator } from "src/components/ui/separator"
import { communityQueries, eventQueries } from "src/services/queries"

export const Route = createFileRoute("/communities/$communityId")({
  loader: async ({ params, context }) => {
    await context.queryClient.ensureQueryData(
      communityQueries.detail(+params.communityId),
    )
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { communityId } = Route.useParams()
  const navigate = useNavigate()

  const { data: community } = useSuspenseQuery(
    communityQueries.detail(+communityId),
  )

  const eventsQuery = useSuspenseQuery(
    eventQueries.list({ communityId: +communityId }),
  )

  const isAdmin = community.userRole === "admin"

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
    </Layout>
  )
}
