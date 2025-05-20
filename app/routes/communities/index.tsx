import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"
import { CommunityCard } from "~/components/community/community-card"
import { CommunityCardSkeletons } from "~/components/community/community-card-skeleton"
import { Layout } from "~/components/layout"
import { communityQueries } from "~/services/queries"

export const Route = createFileRoute("/communities/")({
  component: RouteComponent,
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(communityQueries.list())
  },
})

function RouteComponent() {
  return (
    <Layout className="items-center gap-2">
      <h1 className="text-2xl font-bold">Public Communities</h1>
      <Suspense fallback={<CommunityCardSkeletons />}>
        <Communities />
      </Suspense>
    </Layout>
  )
}

function Communities() {
  const { data: communities } = useSuspenseQuery(communityQueries.list())

  return (
    <ul className="space-y-2 min-w-[40%] max-w-[90%]">
      {communities.map((community) => (
        <CommunityCard key={community.id} community={community} />
      ))}
    </ul>
  )
}
