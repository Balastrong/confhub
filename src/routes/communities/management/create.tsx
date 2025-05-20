
import { Layout } from "src/components/layout"
import { CreateCommunityForm } from "src/components/community/create-community-form"

export const Route = createFileRoute({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Layout className="items-center gap-2">
      <h1 className="text-2xl font-bold">Create a Community</h1>
      <CreateCommunityForm />
    </Layout>
  )
}
