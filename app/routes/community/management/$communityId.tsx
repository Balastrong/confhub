import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { EditCommunityForm } from "~/components/edit-community-form"
import { Layout } from "~/components/layout"
import { communityQueries, eventQueries } from "~/services/queries"

export const Route = createFileRoute("/community/management/$communityId")({
  loader: async ({ params, context }) => {
    if (!params.communityId) throw new Error("Community ID is required")

    await context.queryClient.ensureQueryData(
      communityQueries.detail(+params.communityId),
    )
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { communityId } = Route.useParams()

  const eventsQuery = useSuspenseQuery(
    eventQueries.list({ communityId: +communityId, communityDraft: true }),
  )

  return (
    <Layout className="items-center gap-2 max-w-md">
      <h1 className="text-2xl font-bold">Edit Community</h1>
      <EditCommunityForm communityId={+communityId} />
      <h2 className="text-xl font-bold">Draft Events</h2>
      {eventsQuery.data.map((event) => (
        <span key={event.id}>{event.name}</span>
      ))}
    </Layout>
  )
}
