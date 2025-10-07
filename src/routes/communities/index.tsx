import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"
import { ButtonLink } from "src/components/button-link"
import { CommunityCard } from "src/components/community/community-card"
import { CommunityCardSkeletons } from "src/components/community/community-card-skeleton"
import { Layout } from "src/components/layout"
import { communityQueries } from "src/services/queries"
import { seo } from "~/lib/seo"

export const Route = createFileRoute("/communities/")({
  component: RouteComponent,
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(communityQueries.list())
  },
  head: () => ({
    meta: seo({
      title: "Public Communities",
      description: "Explore and join public communities on ConfHub",
    }),
  }),
})

function RouteComponent() {
  return (
    <Layout>
      <div className="w-full max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Public Communities</h1>
          <ButtonLink to="/communities/create">Create Community</ButtonLink>
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
