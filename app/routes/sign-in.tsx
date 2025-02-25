import { createFileRoute, Link, redirect } from "@tanstack/react-router"
import { Layout } from "~/components/layout"
import { SignInForm } from "~/components/auth/sign-in-form"

export const Route = createFileRoute("/sign-in")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (context.authState.isAuthenticated) {
      throw redirect({ to: "/" })
    }
  },
})

function RouteComponent() {
  return (
    <Layout className="items-center gap-2 max-w-md">
      <SignInForm />
      <small>
        <Link to="/sign-up" className="group">
          Do you want to create an account instead?{" "}
          <span className="underline group-hover:no-underline">Sign Up</span>
        </Link>
      </small>
    </Layout>
  )
}
