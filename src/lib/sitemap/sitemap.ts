import { FileRouteTypes } from "~/routeTree.gen"
import { formatDate } from "../date"
import { Sitemap } from "./sitemap-types"

export type TRoutes = FileRouteTypes["fullPaths"]

const URL = "https://confhub.tech"

export const sitemap: Sitemap<TRoutes> = {
  siteUrl: URL,
  routes: {
    "/": {
      priority: 0.8,
    },
    "/communities": {},
    "/calendar": {},
    "/events/$eventSlug": async () => {
      const thirtyDaysAgo = formatDate(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      )

      const result = await fetch(
        `${URL}/_serverFn/src_services_event_api_ts--getEvents_createServerFn_handler?payload={"data":{"limit":100,"startDate":"${thirtyDaysAgo}"},"context":{}}&createServerFn`,
      )
      const events = (await result.json()).result

      return events.map((event: { slug: string }) => ({
        path: `/events/${event.slug}`,
        priority: 0.8,
      }))
    },
    "/communities/$communitySlug": async () => {
      const result = await fetch(
        `${URL}/_serverFn/src_services_community_api_ts--getCommunities_createServerFn_handler?payload={"data":{},"context":{}}&createServerFn`,
      )
      const communities = (await result.json()).result

      if (!communities) {
        return []
      }

      return communities.map((community: { slug: string }) => ({
        path: `/communities/${community.slug}`,
        priority: 0.8,
      }))
    },
  },
}
