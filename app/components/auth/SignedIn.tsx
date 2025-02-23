import { useAuthentication } from "~/services/queries"

export const SignedIn = ({ children }: { children: React.ReactNode }) => {
  const { data } = useAuthentication()

  if (!data.isAuthenticated) return null

  return <>{children}</>
}
