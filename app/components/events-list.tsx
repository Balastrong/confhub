import { useSuspenseQuery } from "@tanstack/react-query";
import { EventCard } from "./event-card";
import { eventQueries } from "~/queries";
import { getRouteApi } from "@tanstack/react-router";

export const EventsList = () => {
  const { tags = [] } = getRouteApi("/").useSearch();
  const eventsQuery = useSuspenseQuery(eventQueries.list({ tags }));

  return eventsQuery.data?.map((event) => (
    <EventCard key={event.id} event={event} />
  ));
};
