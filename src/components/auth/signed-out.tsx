import { useAuthentication } from "~/lib/auth/client"

export const SignedOut = ({ children }: { children: React.ReactNode }) => {
  const { userSession } = useAuthentication()

  if (userSession) return null

  return <>{children}</>
}
