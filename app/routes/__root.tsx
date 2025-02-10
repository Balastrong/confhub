import { QueryClient } from "@tanstack/react-query"
import {
  createRootRouteWithContext,
  Outlet,
  ScrollRestoration,
} from "@tanstack/react-router"
import { Meta, Scripts } from "@tanstack/start"
import * as React from "react"
import { Header } from "~/components/header"
import { Toaster } from "~/components/ui/sonner"
// @ts-expect-error
import css from "~/globals.css?url"
import { authQueries } from "~/services/queries"

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  beforeLoad: async ({ context }) => {
    const authState = await context.queryClient.fetchQuery(authQueries.user())

    return { authState }
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "ConfHub!",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: css,
      },
      {
        rel: "icon",
        type: "image/png",
        href: "favicon.png",
      },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <Meta />
      </head>
      <body>
        <Header />
        <hr />
        {children}
        <Scripts />
        <Toaster />
      </body>
    </html>
  )
}
