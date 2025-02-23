import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/community/management/$communityId")({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/community/management/$communityId"!</div>
}
