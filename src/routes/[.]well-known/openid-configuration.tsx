import { createServerFileRoute } from "@tanstack/react-start/server"
import { oAuthDiscoveryMetadata } from "better-auth/plugins"
import { auth } from "~/lib/auth/auth"

export const ServerRoute = createServerFileRoute(
  "/.well-known/openid-configuration",
).methods({
  GET: ({ request }) => {
    return oAuthDiscoveryMetadata(auth)(request)
  },
})
