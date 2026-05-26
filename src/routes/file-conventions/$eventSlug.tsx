import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/file-conventions/$eventSlug')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/file-conventions/$eventSlug"!</div>
}
