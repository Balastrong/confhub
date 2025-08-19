import { QueryClient } from "@tanstack/react-query"
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router"
import * as React from "react"
import { Header } from "~/components/header/header"
import { Toaster } from "src/components/ui/sonner"
import { authQueries } from "src/services/queries"
import css from "~/globals.css?url"
import { ThemeProvider } from "~/hooks/useTheme"
import { seo } from "~/lib/seo"
import { analyticsScripts } from "~/lib/analytics"

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  beforeLoad: async ({ context }) => {
    const userSession = await context.queryClient.fetchQuery(authQueries.user())

    return { userSession }
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
      ...seo({
        title: "ConfHub",
        description:
          "Find the latest tech conferences and communities worldwide on ConfHub, leave reviews and interact with other attendees.",
        keywords: "conference, tech, events, cfp",
        disableTitleSuffix: true,
      }),
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
    scripts: process.env.NODE_ENV === "production" ? analyticsScripts : [],
  }),
  shellComponent: RootDocument,
})

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider>
          <Header />
          <hr />
          {children}
          <Scripts />
          <Toaster />
          <React.Suspense>
            <TanStackRouterDevtools />
          </React.Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}
