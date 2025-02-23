import { createFileRoute } from "@tanstack/react-router"
import { Layout } from "~/components/layout"
import { EditCommunityForm } from "~/components/edit-community-form"
import { communityQueries } from "~/services/queries"

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

  return (
    <Layout className="items-center gap-2 max-w-md">
      <h1 className="text-2xl font-bold">Edit Community</h1>
      <EditCommunityForm communityId={+communityId} />
    </Layout>
  )
}
