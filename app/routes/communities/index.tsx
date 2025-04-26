import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense, useState } from "react"
import { CommunityCard } from "~/components/community/community-card"
import { Layout } from "~/components/layout"
import { Button } from "~/components/ui/button"
import { communityQueries } from "~/services/queries"

export const Route = createFileRoute("/communities/")({
  component: RouteComponent,
  loader: ({ context }) => {
    // context.queryClient.ensureQueryData(communityQueries.list())
  },
  pendingComponent: () => <Layout>Loading...</Layout>,
})

function RouteComponent() {
  const [count, setCount] = useState(0)

  return (
    <Layout className="items-center gap-2">
      <h1 className="text-2xl font-bold">Public Communities</h1>
      <Suspense fallback="Loading communities...">
        <Communities />
      </Suspense>
      <Button variant="outline" onClick={() => setCount((c) => c + 1)}>
        Increase: {count}
      </Button>
    </Layout>
  )
}

function Communities() {
  const { data: communities } = useSuspenseQuery(communityQueries.list())
  console.log("Rendering communities")

  return (
    <ul className="space-y-2 min-w-[40%] max-w-[90%]">
      {communities.map((community) => (
        <CommunityCard key={community.id} community={community} />
      ))}
    </ul>
  )
}
