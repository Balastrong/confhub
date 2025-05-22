import { useAuthentication } from "~/lib/auth/client"

export const SignedIn = ({ children }: { children: React.ReactNode }) => {
  const { data } = useAuthentication()

  if (!data) return null

  return <>{children}</>
}
