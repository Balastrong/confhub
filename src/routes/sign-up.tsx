import { Link, redirect, createFileRoute } from "@tanstack/react-router"
import { Layout } from "src/components/layout"
import { SignUpForm } from "src/components/auth/sign-up-form"
import { SocialLogins } from "src/components/auth/social-logins"
import { Separator } from "src/components/ui/separator"

export const Route = createFileRoute("/sign-up")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (context.userSession) {
      throw redirect({ to: "/" })
    }
  },
})

function RouteComponent() {
  return (
    <Layout className="items-center gap-2 max-w-md">
      <div className="flex flex-col gap-4 w-full">
        <SocialLogins />

        <div className="relative">
          <Separator />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-background px-2 text-muted-foreground text-sm">
              or
            </span>
          </div>
        </div>

        <SignUpForm />
      </div>
      <small>
        <Link to="/sign-in" className="group">
          Do you already have an account?{" "}
          <span className="underline group-hover:no-underline">Sign In</span>
        </Link>
      </small>
    </Layout>
  )
}
