import {  redirect } from "@tanstack/react-router"
import { ProfileCard } from "src/components/profile-card"

export const Route = createFileRoute({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (!context.authState.isAuthenticated) {
      throw redirect({ to: "/" })
    }
  },
})

function RouteComponent() {
  return <ProfileCard />
}
