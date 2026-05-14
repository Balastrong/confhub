import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import {
  createEventComment,
  deleteEventComment,
  listEventComments,
} from "./api"
import type { CreateEventComment, DeleteEventComment } from "./schema"

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
