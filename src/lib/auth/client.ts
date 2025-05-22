import { useQuery } from "@tanstack/react-query"
import { createAuthClient } from "better-auth/react"
import { authQueries } from "~/services/queries"

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_SERVER_URL,
})

export const useAuthentication = () => useQuery(authQueries.user())

export const useAuthenticatedUser = () => {
  const { data } = useAuthentication()

  if (!data) {
    throw new Error("User is not authenticated!")
  }

  return data
}
