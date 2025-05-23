import { useAuthentication } from "~/lib/auth/client"

export const SignedIn = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthentication()

  if (!isAuthenticated) return null

  return <>{children}</>
}
