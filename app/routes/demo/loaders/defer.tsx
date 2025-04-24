import { Await, createFileRoute, defer } from "@tanstack/react-router"
import { getSlowData } from "./route"
import { Suspense } from "react"

export const Route = createFileRoute("/demo/loaders/defer")({
  component: RouteComponent,
  loader: async () => {
    return {
      fastData: "hello I'm fast",
      slowDataPromise: defer(getSlowData()),
    }
  },
  staleTime: 5000,
})

function RouteComponent() {
  const data = Route.useLoaderData()

  return (
    <div>
      <div>Fast data: {data.fastData}</div>
      <div>
        <Suspense fallback={"Loading..."}>
          <Await promise={data.slowDataPromise}>
            {({ theAnswer, time }) => (
              <div>
                The answer is: <strong>{theAnswer}</strong> at{" "}
                <strong>{time}</strong>
              </div>
            )}
          </Await>
        </Suspense>
      </div>
    </div>
  )
}
