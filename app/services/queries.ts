import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
  UseSuspenseQueryResult,
} from "@tanstack/react-query"
import { getUser } from "./auth.api"
import { upsertEvent, getEvent, getEvents } from "./event.api"
import { EventFilters } from "./event.schema"
import { getTags } from "./tags.api"
import { getCommunities, getCommunity } from "./community.api"
import { CommunityFilters } from "./community.schema"

export const eventQueries = {
  all: ["events"],
  list: (filters: EventFilters) =>
    queryOptions({
      queryKey: [...eventQueries.all, "list", filters],
      queryFn: () => getEvents({ data: filters }),
    }),
  detail: (eventId: number) =>
    queryOptions({
      queryKey: [...eventQueries.all, "detail", eventId],
      queryFn: () => getEvent({ data: { id: eventId } }),
      enabled: !isNaN(eventId) && !!eventId,
    }),
}

export const useUpsertEventMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Parameters<typeof upsertEvent>[0]) => upsertEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventQueries.all })
    },
  })
}

export const tagQueries = {
  all: ["tags"],
  list: () =>
    queryOptions({
      queryKey: [...tagQueries.all, "list"],
      queryFn: () => getTags(),
    }),
}

export const authQueries = {
  all: ["auth"],
  user: () =>
    queryOptions({
      queryKey: [...authQueries.all, "user"],
      queryFn: () => getUser(),
    }),
}

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
}

export const useAuthentication = () => {
  return useSuspenseQuery(authQueries.user())
}

export const useAuthenticatedUser = () => {
  const authQuery = useAuthentication()

  if (authQuery.data.isAuthenticated === false) {
    throw new Error("User is not authenticated!")
  }

  return authQuery as UseSuspenseQueryResult<typeof authQuery.data>
}
