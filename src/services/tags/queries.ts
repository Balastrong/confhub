import { queryOptions } from "@tanstack/react-query"
import { getTags } from "./api"

export const tagQueries = {
  all: ["tags"],
  list: () =>
    queryOptions({
      queryKey: [...tagQueries.all, "list"],
      queryFn: () => getTags(),
    }),
}
