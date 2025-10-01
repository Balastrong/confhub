import { createFileRoute } from "@tanstack/react-router"
import { oAuthDiscoveryMetadata } from "better-auth/plugins"
import { auth } from "~/lib/auth/auth"

export const Route = createFileRoute("/.well-known/openid-configuration")({
  server: {
    handlers: {
      GET: ({ request }) => {
        return oAuthDiscoveryMetadata(auth)(request)
      },
    },
  },
})
