import { createFileRoute } from "@tanstack/react-router"
import { Layout } from "~/components/layout"
import { CreateCommunityForm } from "~/components/community/create-community-form"

export const Route = createFileRoute("/communities/management/create")({
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
