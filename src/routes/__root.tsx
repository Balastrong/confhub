import { QueryClient } from "@tanstack/react-query"
import {
  createRootRouteWithContext,
  Outlet,
  Scripts,
  HeadContent,
} from "@tanstack/react-router"
import * as React from "react"
import { Header } from "src/components/header"
import { Toaster } from "src/components/ui/sonner"
import css from "~/globals.css?url"
import { authQueries } from "src/services/queries"

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  beforeLoad: async ({ context }) => {
    const authState = await context.queryClient.ensureQueryData(
      authQueries.user(),
    )

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
        href: "/favicon.png",
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

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null
    : React.lazy(() =>
        import("@tanstack/react-router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      )

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <Header />
        <hr />
        {children}
        <Scripts />
        <Toaster />
        <React.Suspense>
          <TanStackRouterDevtools />
        </React.Suspense>
      </body>
    </html>
  )
}
