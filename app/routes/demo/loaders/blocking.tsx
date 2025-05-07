import { createFileRoute } from "@tanstack/react-router"
import { getSlowData } from "./route"

export const Route = createFileRoute("/demo/loaders/blocking")({
  component: RouteComponent,
  loader: getSlowData,
  pendingComponent: () => <div>Loading...</div>,
  // pendingMs: 0, // Default is 1000
  // staleTime: 5000, // Default is 0
})

function RouteComponent() {
  const { theAnswer, time } = Route.useLoaderData()

  return (
    <div>
      The answer is: <strong>{theAnswer}</strong> at <strong>{time}</strong>
    </div>
  )
}
