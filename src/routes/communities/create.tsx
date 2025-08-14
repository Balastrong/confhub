import { createFileRoute } from "@tanstack/react-router"
import { Layout } from "src/components/layout"
import { CreateCommunityForm } from "src/components/community/create-community-form"
import { seo } from "~/components/seo"

export const Route = createFileRoute("/communities/create")({
  component: RouteComponent,
  head: () => ({
    meta: seo({
      title: "Create a Community - ConfHub",
      description: "Create a new community on ConfHub",
    }),
  }),
})

function RouteComponent() {
  return (
    <Layout className="items-center gap-2">
      <h1 className="text-2xl font-bold">Create a Community</h1>
      <CreateCommunityForm />
    </Layout>
  )
}
