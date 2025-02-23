import { createFileRoute } from "@tanstack/react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import { communityQueries } from "~/services/queries"

export const Route = createFileRoute("/community/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: communities } = useSuspenseQuery(communityQueries.list())

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Communities</h1>
      <ul className="space-y-2">
        {communities?.map((community) => (
          <li key={community.id} className="p-4 border rounded-lg">
            {community.name}
          </li>
        ))}
      </ul>
    </div>
  )
}
