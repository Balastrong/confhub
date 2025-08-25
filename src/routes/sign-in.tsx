import { createFileRoute, Link, redirect } from "@tanstack/react-router"
import { SignInForm } from "src/components/auth/sign-in-form"
import { SocialLogins } from "src/components/auth/social-logins"
import { Layout } from "src/components/layout"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "src/components/ui/card"
import { Separator } from "src/components/ui/separator"
import { AuthSwitcher } from "src/components/auth/auth-switcher"

export const Route = createFileRoute("/sign-in")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (context.userSession) {
      throw redirect({ to: "/" })
    }
  },
})

function RouteComponent() {
  return (
    <Layout className="items-center gap-6 max-w-md">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>
            Sign in with Google, GitHub, or your email.
          </CardDescription>
          <div className="my-2">
            <AuthSwitcher mode="sign-in" />
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <SocialLogins />
          <div className="relative">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-background px-2 text-muted-foreground text-xs uppercase tracking-wide">
                or
              </span>
            </div>
          </div>
          <SignInForm />
        </CardContent>
      </Card>
    </Layout>
  )
}
