import { createFileRoute, Link, redirect } from "@tanstack/react-router"
import { Layout } from "~/components/layout"
import { SubmitForm } from "~/components/submit-form"

export const Route = createFileRoute("/review/submit")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Layout className="items-center gap-2 max-w-md">
      <SubmitForm />
    </Layout>
  )
}
