import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/demo/nested/example")({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/demo/nested/example"!</div>
}
