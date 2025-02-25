import { createFileRoute, Link, redirect } from "@tanstack/react-router"
import { SubmitForm } from "~/components/event/submit-form"
import { Layout } from "~/components/layout"

export const Route = createFileRoute("/events/submit")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Layout className="items-center gap-2">
      <SubmitForm />
    </Layout>
  )
}
