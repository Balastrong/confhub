import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import { SubmitForm } from "src/components/event/submit-form"
import { Layout } from "src/components/layout"
import { z } from "zod"
import { ButtonLink } from "~/components/button-link"
import { communityQueries } from "~/services/queries"

export const Route = createFileRoute("/events/submit")({
  component: RouteComponent,
  validateSearch: z.object({
    communityId: z.number().optional(),
  }),
})

function RouteComponent() {
  const search = Route.useSearch()

  const { data: community } = useQuery({
    ...communityQueries.detail(search.communityId!),
    enabled: !!search.communityId,
  })

  return (
    <Layout className="items-center gap-2">
      {search?.communityId && community && (
        <div className="w-full">
          <ButtonLink
            variant="ghost"
            size="sm"
            className="mb-2"
            to="/communities/$communitySlug"
            params={{ communitySlug: community.slug }}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to community
          </ButtonLink>
        </div>
      )}
      <SubmitForm />
    </Layout>
  )
}
