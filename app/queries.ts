import { queryOptions, useMutation } from "@tanstack/react-query";
import { getEvents } from "./db/events";
import { getTags } from "./db/tags";
import { Filters } from "./routes";

export const eventQueries = {
  all: ["events"],
  list: (filters: Filters) =>
    queryOptions({
      queryKey: [...eventQueries.all, "list", filters],
      queryFn: () => getEvents({ data: filters }),
    }),
};

export const tagQueries = {
  all: ["tags"],
  list: () =>
    queryOptions({
      queryKey: [...tagQueries.all, "list"],
      queryFn: () => getTags(),
    }),
};
