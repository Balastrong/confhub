import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/profile")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (!context.authState.isAuthenticated) {
      throw redirect({ to: "/" })
    }
  },
})

function RouteComponent() {
  return <div>Hello "/profile"!</div>
}
