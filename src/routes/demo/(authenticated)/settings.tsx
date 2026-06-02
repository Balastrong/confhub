import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/demo/(authenticated)/settings")({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(authenticated)/settings"!</div>
}
