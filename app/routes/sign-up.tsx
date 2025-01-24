import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { Layout } from '~/components/layout'
import { SignUp } from '~/components/sign-up'

export const Route = createFileRoute('/sign-up')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (context.user) {
      throw redirect({ to: '/' })
    }
  },
})

function RouteComponent() {
  return (
    <Layout className="items-center gap-2 max-w-md">
      <SignUp />
      <small>
        <Link to="/sign-in">Do you already have an account?</Link>
      </small>
    </Layout>
  )
}
