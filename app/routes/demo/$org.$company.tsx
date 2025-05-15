import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/demo/$org/$company")({
  component: RouteComponent,
})

function RouteComponent() {
  const { company } = Route.useParams()

  return <div>Hello {company}!</div>
}
