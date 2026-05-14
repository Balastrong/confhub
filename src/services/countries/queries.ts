import { queryOptions } from "@tanstack/react-query"
import { getCountries } from "./api"

export const countryQueries = {
  all: ["countries"],
  list: () =>
    queryOptions({
      queryKey: [...countryQueries.all, "list"],
      queryFn: () => getCountries(),
    }),
}
