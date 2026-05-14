import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import {
  getEventRsvpCounts,
  getMyRsvpEvents,
  getMyRsvpForEvent,
  removeMyRsvpForEvent,
  upsertMyRsvpForEvent,
} from "./api"
import type { UpsertRsvp } from "./schema"

export const rsvpQueries = {
  all: ["eventRsvp"],
  myRsvp: (eventId: number) =>
    queryOptions({
      queryKey: [...rsvpQueries.all, "myRsvp", eventId],
      queryFn: () => getMyRsvpForEvent({ data: { eventId } }),
      enabled: !isNaN(eventId) && !!eventId,
    }),
  counts: (eventId: number) =>
    queryOptions({
      queryKey: [...rsvpQueries.all, "counts", eventId],
      queryFn: () => getEventRsvpCounts({ data: { eventId } }),
      enabled: !isNaN(eventId) && !!eventId,
    }),
  myEvents: () =>
    queryOptions({
      queryKey: [...rsvpQueries.all, "myEvents"],
      queryFn: () => getMyRsvpEvents(),
      staleTime: 10_000,
    }),
}

export const useUpsertRsvpMutation = (eventId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { data: UpsertRsvp }) =>
      upsertMyRsvpForEvent(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...rsvpQueries.all, "myRsvp", eventId],
      })
      queryClient.invalidateQueries({
        queryKey: [...rsvpQueries.all, "counts", eventId],
      })
    },
  })
}

export const useRemoveRsvpMutation = (eventId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { data: { eventId: number } }) =>
      removeMyRsvpForEvent(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...rsvpQueries.all, "myRsvp", eventId],
      })
      queryClient.invalidateQueries({
        queryKey: [...rsvpQueries.all, "counts", eventId],
      })
    },
  })
}
