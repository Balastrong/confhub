import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { EditCommunityForm } from "~/components/edit-community-form"
import { EventManagementCard } from "~/components/event-management-card"
import { Layout } from "~/components/layout"
import { communityQueries, eventQueries } from "~/services/queries"

export const Route = createFileRoute("/communities/management/$communityId")({
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
    eventQueries.list({ communityId: +communityId, communityDraft: true }),
  )

  return (
    <Layout className="items-center gap-2 max-w-md">
      <h1 className="text-2xl font-bold">{community?.name}</h1>
      <h2 className="text-xl font-semibold">Draft Events</h2>
      <div className="flex flex-col gap-2 w-full">
        {eventsQuery.data.map((event) => (
          <EventManagementCard
            key={event.id}
            event={event}
            onEdit={(event) => {
              navigate({
                to: "/events/$eventId",
                params: { eventId: `${event.id}` },
              })
            }}
          />
        ))}
      </div>
      <h2 className="text-xl font-semibold">Edit Data</h2>
      <EditCommunityForm communityId={+communityId} />
    </Layout>
  )
}
