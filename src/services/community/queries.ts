import { queryOptions } from "@tanstack/react-query"
import { getCommunities, getCommunity } from "./api"
import type { CommunityFilters } from "./schema"

export const communityQueries = {
  all: ["communities"],
  list: (filters?: CommunityFilters) =>
    queryOptions({
      queryKey: [...communityQueries.all, "list", filters],
      queryFn: () => getCommunities({ data: filters || {} }),
    }),
  detail: (communityId: number) =>
    queryOptions({
      queryKey: [...communityQueries.all, "detail", communityId],
      queryFn: () => getCommunity({ data: { id: communityId } }),
    }),
  detailBySlug: (communitySlug: string) =>
    queryOptions({
      queryKey: [...communityQueries.all, "detailBySlug", communitySlug],
      queryFn: () => getCommunity({ data: { slug: communitySlug } }),
      enabled: !!communitySlug,
    }),
}
