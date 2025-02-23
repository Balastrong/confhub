import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
  UseSuspenseQueryResult,
} from "@tanstack/react-query"
import { getUser } from "./auth.api"
import { createEvent, getEvents } from "./event.api"
import { EventFilters } from "./event.schema"
import { getTags } from "./tags.api"
import { getCommunities } from "./community.api"

export const eventQueries = {
  all: ["events"],
  list: (filters: EventFilters) =>
    queryOptions({
      queryKey: [...eventQueries.all, "list", filters],
      queryFn: () => getEvents({ data: filters }),
    }),
}

export const useCreateEventMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createEvent,
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
  list: () =>
    queryOptions({
      queryKey: [...communityQueries.all, "list"],
      queryFn: () => getCommunities(),
    }),
}

export const useAuthenticatedUser = () => {
  const authQuery = useSuspenseQuery(authQueries.user())

  if (authQuery.data.isAuthenticated === false) {
    throw new Error("User is not authenticated!")
  }

  return authQuery as UseSuspenseQueryResult<typeof authQuery.data>
}
