import { FileRouteTypes } from "~/routeTree.gen"
import { formatDate } from "../date"
import { Sitemap } from "./sitemap-types"
import { db } from "~/lib/db"
import { and, or, eq, gte } from "drizzle-orm"
import { communityTable, eventTable } from "~/lib/db/schema"

export type TRoutes = FileRouteTypes["fullPaths"]

const URL = "https://confhub.tech"

export const sitemap: Sitemap<TRoutes> = {
  siteUrl: URL,
  routes: {
    "/": {
      lastModified: new Date(),
    },
    "/communities": { lastModified: new Date() },
    "/calendar": { lastModified: new Date() },
    "/events/$eventSlug": async () => {
      // Upcoming + recently ended events (last 30 days)
      const thirtyDaysAgo = formatDate(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      )

      const rows = await db
        .select({ slug: eventTable.slug })
        .from(eventTable)
        .where(
          and(
            eq(eventTable.draft, false),
            or(gte(eventTable.date, thirtyDaysAgo)),
          ),
        )

      return rows.map((event) => ({
        path: `/events/${event.slug}`,
      }))
    },
    "/communities/$communitySlug": async () => {
      const rows = await db
        .select({ slug: communityTable.slug })
        .from(communityTable)

      return rows.map((community) => ({
        path: `/communities/${community.slug}`,
      }))
    },
  },
}
