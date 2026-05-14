import { eq } from "drizzle-orm"
import { auth } from "~/lib/auth/auth"
import { db } from "~/lib/db"
import { userTable } from "~/lib/db/schema"
import type { UserMeta } from "./schema"

export type AuthServiceDeps = {
  authApi: typeof auth.api
  db: typeof db
}

export function createAuthService(deps: AuthServiceDeps) {
  return {
    async getSession(headers: Headers) {
      const userSession = await deps.authApi.getSession({ headers })

      if (!userSession) {
        return null
      }

      return {
        user: userSession.user,
        session: userSession.session,
      }
    },

    async updateUser(userId: string, data: UserMeta) {
      const update: Record<string, unknown> = { name: data.username }

      if (data.imageUrl) {
        update.image = data.imageUrl
      }

      await deps.db
        .update(userTable)
        .set(update)
        .where(eq(userTable.id, userId))
    },
  }
}

export const authService = createAuthService({
  authApi: auth.api,
  db,
})
