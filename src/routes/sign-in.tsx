import { Link, redirect, createFileRoute } from "@tanstack/react-router"
import { Layout } from "src/components/layout"
import { SignInForm } from "src/components/auth/sign-in-form"
import { SocialLogins } from "src/components/auth/social-logins"
import { Separator } from "src/components/ui/separator"

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

        <SignInForm />
      </div>
      <small>
        <Link to="/sign-up" className="group">
          Do you want to create an account instead?{" "}
          <span className="underline group-hover:no-underline">Sign Up</span>
        </Link>
      </small>
    </Layout>
  )
}
