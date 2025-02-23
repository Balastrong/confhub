import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/community/$communityId")({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/community/$communityId"!</div>
}
