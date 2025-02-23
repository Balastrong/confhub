import { createFileRoute } from '@tanstack/react-router'
import { Layout } from '~/components/layout'
import { CreateCommunityForm } from '~/components/create-community-form'

export const Route = createFileRoute('/communities/management/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Layout className="items-center gap-2 max-w-md">
      <h1 className="text-2xl font-bold">Create a Community</h1>
      <CreateCommunityForm />
    </Layout>
  )
}
