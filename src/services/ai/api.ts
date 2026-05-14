import { createServerFn } from "@tanstack/react-start"
import z from "zod"
import { userRequiredMiddleware } from "~/services/auth/api"
import { generateFilters } from "./service.server"

export const generateFiltersSchema = createServerFn({ method: "POST" })
  .inputValidator(z.string())
  .middleware([userRequiredMiddleware])
  .handler(async ({ data, context: { userSession } }) => {
    return generateFilters(userSession.user.id, data)
  })
