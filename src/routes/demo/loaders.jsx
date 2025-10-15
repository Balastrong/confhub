import { createFileRoute } from "@tanstack/react-router"
import { format } from "date-fns"

export async function getSlowData() {
  await new Promise((resolve) => setTimeout(resolve, 2000))

  return {
    theAnswer: 42,
    time: format(new Date(), "HH:mm:ss"),
  }
}

export const Route = createFileRoute("/demo/loaders")({
  component: RouteComponent,
  loader: getSlowData,
  pendingComponent: () => <div>Loading...</div>,
  pendingMs: 0,
})

function RouteComponent() {
  const loaderData = Route.useLoaderData()

  return (
    <div className="text-2xl m-4">
      The answer is: <strong>{loaderData.theAnswer}</strong> at{" "}
      <strong>{loaderData.time}</strong>
    </div>
  )
}
