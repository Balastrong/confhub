import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { getEvent, getEventBySlug, getEvents, upsertEvent } from "./api"
import type { EventFilters } from "./schema"

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
  detailBySlug: (eventSlug: string) =>
    queryOptions({
      queryKey: [...eventQueries.all, "detailBySlug", eventSlug],
      queryFn: () => getEventBySlug({ data: { slug: eventSlug } }),
      enabled: !!eventSlug,
    }),
}

export const useUpsertEventMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: upsertEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventQueries.all })
    },
  })
}
