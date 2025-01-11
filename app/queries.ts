import { queryOptions, useMutation } from "@tanstack/react-query";
import { getEvents } from "./db/events";
import { getTags } from "./db/tags";

export const eventQueries = {
  all: ["events"],
  list: ({ tags }: { tags: string[] }) =>
    queryOptions({
      queryKey: [...eventQueries.all, "list", tags],
      queryFn: () => getEvents({ data: tags }),
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
