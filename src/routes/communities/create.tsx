import { createFileRoute } from "@tanstack/react-router"
import { Layout } from "src/components/layout"
import { CreateCommunityForm } from "src/components/community/create-community-form"
import { seo } from "~/lib/seo"

export const Route = createFileRoute("/communities/create")({
  component: RouteComponent,
  head: () => ({
    meta: seo({
      title: "Create a Community",
      description: "Create a new community on ConfHub",
    }),
  }),
})

function RouteComponent() {
  return (
    <Layout>
      <CreateCommunityForm />
    </Layout>
  )
}
