import {  Link, redirect } from "@tanstack/react-router"
import { SubmitForm } from "src/components/event/submit-form"
import { Layout } from "src/components/layout"

export const Route = createFileRoute({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Layout className="items-center gap-2">
      <SubmitForm />
    </Layout>
  )
}
