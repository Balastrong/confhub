import { createServerFn } from "@tanstack/react-start"
import { userMiddleware, userRequiredMiddleware } from "~/services/auth/api"
import { GetRsvpSchema, UpsertRsvpSchema } from "./schema"
import { eventRsvpService } from "./service.server"

export const getMyRsvpForEvent = createServerFn({ method: "GET" })
  .inputValidator(GetRsvpSchema)
  .middleware([userMiddleware])
  .handler(async ({ data, context: { userSession } }) => {
    return eventRsvpService.findMyRsvpForEvent(
      userSession?.user?.id,
      data.eventId,
    )
  })

export const upsertMyRsvpForEvent = createServerFn({ method: "POST" })
  .inputValidator(UpsertRsvpSchema)
  .middleware([userRequiredMiddleware])
  .handler(async ({ data, context: { userSession } }) => {
    return eventRsvpService.upsertMyRsvpForEvent(userSession.user.id, data)
  })

export const removeMyRsvpForEvent = createServerFn({ method: "POST" })
  .inputValidator(GetRsvpSchema)
  .middleware([userRequiredMiddleware])
  .handler(async ({ data, context: { userSession } }) => {
    return eventRsvpService.removeMyRsvpForEvent(
      userSession.user.id,
      data.eventId,
    )
  })

export const getEventRsvpCounts = createServerFn({ method: "GET" })
  .inputValidator(GetRsvpSchema)
  .handler(async ({ data }) => {
    return eventRsvpService.getEventRsvpCounts(data.eventId)
  })

export const getMyRsvpEvents = createServerFn({ method: "GET" })
  .middleware([userRequiredMiddleware])
  .handler(async ({ context: { userSession } }) => {
    return eventRsvpService.getMyRsvpEvents(userSession.user.id)
  })
