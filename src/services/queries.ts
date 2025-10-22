import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { getUserSession } from "./auth.api"
import { getCommunities, getCommunity } from "./community.api"
import { CommunityFilters } from "./community.schema"
import { getEvent, getEventBySlug, getEvents, getSimilarEvents, upsertEvent } from "./event.api"
import { EventFilters } from "./event.schema"
import { getTags } from "./tags.api"
import { getCountries } from "./countries.api"
import {
  createEventComment,
  deleteEventComment,
  listEventComments,
} from "./event-comment.api"
import { CreateEventComment, DeleteEventComment } from "./event-comment.schema"
import {
  getMyRsvpForEvent,
  getEventRsvpCounts,
  removeMyRsvpForEvent,
  upsertMyRsvpForEvent,
  getMyRsvpEvents,
} from "./event-rsvp.api"
import { UpsertRsvp } from "./event-rsvp.schema"
import { getEventRequestCount, createEventRequest } from "./event-request.api"

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
  similar: (eventId: number, limit: number = 3) =>
    queryOptions({
      queryKey: [...eventQueries.all, "similar", eventId, limit],
      queryFn: () => getSimilarEvents({ data: { eventId, limit } }),
      enabled: !isNaN(eventId) && !!eventId,
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

export const tagQueries = {
  all: ["tags"],
  list: () =>
    queryOptions({
      queryKey: [...tagQueries.all, "list"],
      queryFn: () => getTags(),
    }),
}

export const countryQueries = {
  all: ["countries"],
  list: () =>
    queryOptions({
      queryKey: [...countryQueries.all, "list"],
      queryFn: () => getCountries(),
    }),
}

export const authQueries = {
  all: ["auth"],
  user: () =>
    queryOptions({
      queryKey: [...authQueries.all, "user"],
      queryFn: () => getUserSession(),
      staleTime: 5000,
    }),
}

export const communityQueries = {
  all: ["communities"],
  list: (filters?: CommunityFilters) =>
    queryOptions({
      queryKey: [...communityQueries.all, "list", filters],
      queryFn: () => getCommunities({ data: filters || {} }),
    }),
  detail: (communityId: number) =>
    queryOptions({
      queryKey: [...communityQueries.all, "detail", communityId],
      queryFn: () => getCommunity({ data: { id: communityId } }),
    }),
  detailBySlug: (communitySlug: string) =>
    queryOptions({
      queryKey: [...communityQueries.all, "detailBySlug", communitySlug],
      queryFn: () => getCommunity({ data: { slug: communitySlug } }),
      enabled: !!communitySlug,
    }),
}

export const commentQueries = {
  all: ["eventComments"],
  listByEvent: (eventId: number) =>
    queryOptions({
      queryKey: [...commentQueries.all, "listByEvent", eventId],
      queryFn: () => listEventComments({ data: { eventId } }),
      enabled: !isNaN(eventId) && !!eventId,
    }),
}

export const useCreateEventCommentMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: { data: CreateEventComment }) =>
      createEventComment(payload),
    onSuccess: (created) => {
      queryClient.invalidateQueries({
        queryKey: [...commentQueries.all, "listByEvent", created.eventId],
      })
    },
  })
}

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

export const useDeleteEventCommentMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: { data: DeleteEventComment }) =>
      deleteEventComment(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [...commentQueries.all, "listByEvent", res.eventId],
      })
    },
  })
}

export const eventRequestQueries = {
  all: ["eventRequests"],
  count: () =>
    queryOptions({
      queryKey: [...eventRequestQueries.all, "count"],
      queryFn: () => getEventRequestCount(),
      staleTime: 30000, // Cache for 30 seconds
    }),
}

export const useCreateEventRequestMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createEventRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: eventRequestQueries.all,
      })
    },
  })
}
