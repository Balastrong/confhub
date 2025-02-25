import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Layout } from "~/components/layout"
import { SubmitForm } from "~/components/submit-form"
import { eventQueries } from "~/services/queries"

export const Route = createFileRoute("/events/$eventid")({
  component: RouteComponent,
})

function RouteComponent() {
  const { eventid } = Route.useParams()

  const { data: event } = useSuspenseQuery(eventQueries.detail(+eventid))

  return (
    <Layout className="items-center gap-2 max-w-md">
      <h1 className="text-2xl font-bold">{event.name}</h1>
      <SubmitForm defaultEvent={event} />
    </Layout>
  )
}
