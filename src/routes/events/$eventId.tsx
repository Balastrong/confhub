import { useSuspenseQuery } from "@tanstack/react-query"
import { } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import { ButtonLink } from "src/components/button-link"
import { SubmitForm } from "src/components/event/submit-form"
import { Layout } from "src/components/layout"
import { eventQueries } from "src/services/queries"

export const Route = createFileRoute({
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
