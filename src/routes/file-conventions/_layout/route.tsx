import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/file-conventions/_layout')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/file-conventions/_layout"!</div>
}
