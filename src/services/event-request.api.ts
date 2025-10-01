import { createServerFn } from "@tanstack/react-start"
import { db } from "~/lib/db"
import { eventRequestTable } from "~/lib/db/schema"
import { CreateEventRequestSchema } from "./event-request.schema"
import { userMiddleware } from "./auth.api"

export const createEventRequest = createServerFn()
  .inputValidator(CreateEventRequestSchema)
  .middleware([userMiddleware])
  .handler(async ({ data, context }) => {
    const userId = context.userSession?.user?.id

    const [newEventRequest] = await db
      .insert(eventRequestTable)
      .values({
        url: data.url,
        userId: userId || null,
      })
      .returning()

    return newEventRequest
  })
