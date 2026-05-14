import { createMiddleware, createServerFn } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"
import { eq } from "drizzle-orm"
import { db } from "~/lib/db"
import { userTable } from "~/lib/db/schema"
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
      throw Response.json(
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
    const update: Record<string, unknown> = { name: data.username }
    if (data.imageUrl) {
      update.image = data.imageUrl
    }

    await db
      .update(userTable)
      .set(update)
      .where(eq(userTable.id, userSession.user.id))
  })
