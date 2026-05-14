import { createServerFn } from "@tanstack/react-start"
import { userMiddleware } from "~/services/auth/api"
import { CreateEventRequestSchema } from "./schema"
import { eventRequestService } from "./service.server"

export const createEventRequest = createServerFn({ method: "POST" })
  .inputValidator(CreateEventRequestSchema)
  .middleware([userMiddleware])
  .handler(async ({ data, context }) => {
    return eventRequestService.createEventRequest(
      data.url,
      context.userSession?.user?.id,
    )
  })
