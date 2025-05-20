import { useAuthentication } from "src/services/queries"

export const SignedOut = ({ children }: { children: React.ReactNode }) => {
  const { data } = useAuthentication()

  if (data.isAuthenticated) return null

  return <>{children}</>
}
