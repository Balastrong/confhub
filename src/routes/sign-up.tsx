import { Link, redirect, createFileRoute } from "@tanstack/react-router"
import { Layout } from "src/components/layout"
import { SignUpForm } from "src/components/auth/sign-up-form"

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
      <SignUpForm />
      <small>
        <Link to="/sign-in" className="group">
          Do you already have an account?{" "}
          <span className="underline group-hover:no-underline">Sign In</span>
        </Link>
      </small>
    </Layout>
  )
}
