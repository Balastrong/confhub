import { createFileRoute } from "@tanstack/react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import {} from "@tanstack/react-router"
import { Suspense } from "react"
import { CommunityCard } from "src/components/community/community-card"
import { CommunityCardSkeletons } from "src/components/community/community-card-skeleton"
import { Layout } from "src/components/layout"
import { ButtonLink } from "src/components/button-link"
import { communityQueries } from "src/services/queries"

export const Route = createFileRoute("/communities/")({
  component: RouteComponent,
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(communityQueries.list())
  },
})

function RouteComponent() {
  return (
    <Layout>
      <div className="w-full max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Public Communities</h1>
          <ButtonLink
            to="/communities/create"
            className="bg-[#0f172a] text-white hover:bg-[#1e293b] rounded-lg"
          >
            Create Community
          </ButtonLink>
        </div>
        <Suspense fallback={<CommunityCardSkeletons />}>
          <Communities />
        </Suspense>
      </div>
    </Layout>
  )
}

function Communities() {
  const { data: communities } = useSuspenseQuery(communityQueries.list())

  return (
    <ul className="space-y-4">
      {communities.map((community) => (
        <CommunityCard key={community.id} community={community} />
      ))}
    </ul>
  )
}
