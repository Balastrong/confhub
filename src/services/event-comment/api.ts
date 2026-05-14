import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"
import { loggingMiddleware } from "~/services/log/api"
import { userRequiredMiddleware } from "~/services/auth/api"
import { CreateEventCommentSchema, DeleteEventCommentSchema } from "./schema"
import { eventCommentService } from "./service.server"

export const listEventComments = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      eventId: z.number(),
    }),
  )
  .handler(async ({ data }) => {
    return eventCommentService.listEventComments(data.eventId)
  })

export const createEventComment = createServerFn({ method: "POST" })
  .inputValidator(CreateEventCommentSchema)
  .middleware([loggingMiddleware, userRequiredMiddleware])
  .handler(async ({ data, context: { userSession } }) => {
    return eventCommentService.createEventComment(userSession.user.id, data)
  })

export const deleteEventComment = createServerFn({ method: "POST" })
  .inputValidator(DeleteEventCommentSchema)
  .middleware([userRequiredMiddleware])
  .handler(async ({ data, context: { userSession } }) => {
    return eventCommentService.deleteEventComment(userSession.user.id, data)
  })
