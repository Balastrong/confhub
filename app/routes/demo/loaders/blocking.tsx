import { createFileRoute } from "@tanstack/react-router"
import { getSlowData } from "./route"

export const Route = createFileRoute("/demo/loaders/blocking")({
  component: RouteComponent,
  loader: getSlowData,
  pendingComponent: () => <div>Loading...</div>,
  // endingMs: 0,
  // staleTime: 5000,
})

function RouteComponent() {
  const { theAnswer, time } = Route.useLoaderData()

  return (
    <div>
      The answer is: <strong>{theAnswer}</strong> at <strong>{time}</strong>
    </div>
  )
}
