import {
  queryOptions,
  useSuspenseQuery,
  UseSuspenseQueryResult,
} from "@tanstack/react-query"
import { getUser } from "./auth.api"
import { getEvents } from "./event.api"
import { getTags } from "./tags.api"
import { EventFilters } from "./event.schema"

export const eventQueries = {
  all: ["events"],
  list: (filters: EventFilters) =>
    queryOptions({
      queryKey: [...eventQueries.all, "list", filters],
      queryFn: () => getEvents({ data: filters }),
    }),
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

export const useAuthenticatedUser = () => {
  const authQuery = useSuspenseQuery(authQueries.user())

  if (authQuery.data.isAuthenticated === false) {
    throw new Error("User is not authenticated!")
  }

  return authQuery as UseSuspenseQueryResult<typeof authQuery.data>
}
