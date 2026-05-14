import { queryOptions } from "@tanstack/react-query"
import { getUserSession } from "./api"

export const authQueries = {
  all: ["auth"],
  user: () =>
    queryOptions({
      queryKey: [...authQueries.all, "user"],
      queryFn: () => getUserSession(),
      staleTime: 60_000,
    }),
}
