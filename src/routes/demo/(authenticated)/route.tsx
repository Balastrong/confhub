import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/demo/(authenticated)")({
  beforeLoad: async ({ context }) => {
    if (!context.userSession) {
      throw redirect({ to: "/" })
    }
  },
})
