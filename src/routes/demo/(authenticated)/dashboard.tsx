import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/demo/(authenticated)/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(authenticated)/dashboard"!</div>
}
