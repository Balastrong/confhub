import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/file-conventions/one/two/three')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/file-conventions/one/two/three"!</div>
}
