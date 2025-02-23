import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/community/management/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/community/management/create"!</div>
}
