import { createMiddleware, createServerFn, json } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"
import { UserMetaSchema } from "./schema"
import { authService } from "./service.server"

export const getUserSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const headers = getRequestHeaders()

    return authService.getSession(headers)
  },
)

export const userMiddleware = createMiddleware().server(async ({ next }) => {
  const userSession = await getUserSession()

  return next({ context: { userSession } })
})

export const userRequiredMiddleware = createMiddleware()
  .middleware([userMiddleware])
  .server(async ({ next, context }) => {
    if (!context.userSession) {
      throw json(
        { message: "You must be logged in to do that!" },
        { status: 401 },
      )
    }

    return next({ context: { userSession: context.userSession } })
  })

export const updateUser = createServerFn({ method: "POST" })
  .inputValidator(UserMetaSchema)
  .middleware([userRequiredMiddleware])
  .handler(async ({ data, context: { userSession } }) => {
    await authService.updateUser(userSession.user.id, data)
  })
