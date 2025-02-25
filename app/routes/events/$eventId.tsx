import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import { ButtonLink } from "~/components/button-link"
import { Layout } from "~/components/layout"
import { SubmitForm } from "~/components/submit-form"
import { eventQueries } from "~/services/queries"

export const Route = createFileRoute("/events/$eventId")({
  component: RouteComponent,
})

function RouteComponent() {
  const { eventId } = Route.useParams()

  const { data: event } = useSuspenseQuery(eventQueries.detail(+eventId))

  return (
    <Layout className="items-center gap-2">
      {event.communityId && (
        <div className="w-full">
          <ButtonLink
            variant="ghost"
            size="sm"
            className="mb-2"
            to="/communities/management/$communityId"
            params={{ communityId: String(event.communityId) }}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to community
          </ButtonLink>
        </div>
      )}
      <h1 className="text-2xl font-bold">{event.name}</h1>
      <SubmitForm defaultEvent={event} />
    </Layout>
  )
}
