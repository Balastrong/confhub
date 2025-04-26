import { createFileRoute, Outlet } from "@tanstack/react-router"
import { format } from "date-fns"
import { ButtonLink } from "~/components/button-link"
import { Layout } from "~/components/layout"

export const Route = createFileRoute("/demo/loaders")({
  component: RouteComponent,
})

export async function getSlowData() {
  console.log("Loading data...")
  await new Promise((resolve) => setTimeout(resolve, 2000))

  return {
    theAnswer: 42,
    time: format(new Date(), "HH:mm:ss"),
  }
}

function RouteComponent() {
  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-2">Loaders Demo</h2>
      <div className="flex flex-wrap gap-2">
        <ButtonLink
          to="/demo/loaders"
          activeOptions={{ exact: true, includeSearch: false }}
          activeProps={{ variant: "secondary" }}
        >
          Home
        </ButtonLink>
        <ButtonLink
          to="/demo/loaders/blocking"
          activeProps={{ variant: "secondary" }}
        >
          Blocking
        </ButtonLink>
        <ButtonLink
          to="/demo/loaders/defer"
          activeProps={{ variant: "secondary" }}
        >
          Defer
        </ButtonLink>
      </div>

      <div className="mt-6 border rounded-lg p-4">
        <Outlet />
      </div>
    </Layout>
  )
}
