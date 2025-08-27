import { createServerFn } from "@tanstack/react-start"
import z from "zod"
import { EventFiltersSchema } from "./event.schema"
import { userRequiredMiddleware } from "./auth.api"

export const generateFiltersSchema = createServerFn({ method: "POST" })
  .validator(z.string())
  .middleware([userRequiredMiddleware])
  .handler(({ data }) => {
    // TODO Count/Rate limit user

    return EventFiltersSchema.parse({
      query: data,
    })
  })
