import { createMiddleware, createServerFn, json } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { eq } from "drizzle-orm"
import { auth } from "~/lib/auth/auth"
import { db } from "~/lib/db"
import { userTable } from "~/lib/db/schema"
import { UserMetaSchema } from "./auth.schema"

export const getUserSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const request = getRequest()

    if (!request?.headers) {
      return null
    }

    const userSession = await auth.api.getSession({ headers: request.headers })

    if (!userSession) return null

    return { user: userSession.user, session: userSession.session }
  },
)

export const userMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const userSession = await getUserSession()

    return next({ context: { userSession } })
  },
)

export const userRequiredMiddleware = createMiddleware({ type: "function" })
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

export const updateUser = createServerFn()
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
