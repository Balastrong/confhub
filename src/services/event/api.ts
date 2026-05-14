import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"
import { userRequiredMiddleware } from "~/services/auth/api"
import { CreateEventSchema, EventFiltersSchema } from "./schema"
import { eventService } from "./service.server"

export const getEvents = createServerFn({ method: "GET" })
  .inputValidator(EventFiltersSchema)
  .handler(async ({ data }) => {
    return eventService.getEvents(data)
  })

export const getEvent = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      id: z.number(),
    }),
  )
  .handler(async ({ data }) => {
    return eventService.getEvent(data.id)
  })

export const getEventBySlug = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      slug: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    return eventService.getEventBySlug(data.slug)
  })

export const upsertEvent = createServerFn({ method: "POST" })
  .inputValidator(CreateEventSchema)
  .middleware([userRequiredMiddleware])
  .handler(async ({ data, context: { userSession } }) => {
    return eventService.upsertEvent(userSession.user.id, data)
  })
