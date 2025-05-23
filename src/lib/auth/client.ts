import { useQuery } from "@tanstack/react-query"
import { createAuthClient } from "better-auth/react"
import { authQueries } from "~/services/queries"

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_SERVER_URL,
})

export const useAuthentication = () => {
  const { data: userSession } = useQuery(authQueries.user())

  return { userSession, isAuthenticated: !!userSession }
}

export const useAuthenticatedUser = () => {
  const { userSession } = useAuthentication()

  if (!userSession) {
    throw new Error("User is not authenticated!")
  }

  return userSession
}
