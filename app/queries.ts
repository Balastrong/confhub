import { queryOptions } from "@tanstack/react-query"
import { getUser } from "./db/auth"
import { getEvents } from "./db/events"
import { getTags } from "./db/tags"
import { Filters } from "./routes"

export const eventQueries = {
  all: ["events"],
  list: (filters: Filters) =>
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
