import { createMiddleware, createServerFn, json } from "@tanstack/react-start"
import { getWebRequest } from "@tanstack/react-start/server"
import { eq } from "drizzle-orm"
import { auth } from "~/lib/auth/auth"
import { db } from "~/lib/db"
import { userTable } from "~/lib/db/schema"
import { UserMetaSchema } from "./auth.schema"

export const userMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const authData = await getUserSession()

    return next({
      context: {
        authData,
      },
    })
  },
)

export const userRequiredMiddleware = createMiddleware({ type: "function" })
  .middleware([userMiddleware])
  .server(async ({ next, context }) => {
    if (!context.authData) {
      throw json(
        { message: "You must be logged in to access this resource!" },
        { status: 401 },
      )
    }

    return next({
      context: {
        authData: context.authData,
      },
    })
  })

export const getUserSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const request = getWebRequest()

    if (!request?.headers) {
      return null
    }

    const authData = await auth.api.getSession({
      headers: request.headers,
    })

    return authData
  },
)

export const updateUser = createServerFn()
  .validator(UserMetaSchema)
  .middleware([userRequiredMiddleware])
  .handler(async ({ data, context: { authData } }) => {
    db.update(userTable)
      .set({ name: data.username })
      .where(eq(userTable.id, authData.user.id))
  })
