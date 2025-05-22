import { ArrowLeft } from "lucide-react"
import { SubmitForm } from "src/components/event/submit-form"
import { Layout } from "src/components/layout"
import { z } from "zod"
import { ButtonLink } from "~/components/button-link"

export const Route = createFileRoute({
  component: RouteComponent,
  validateSearch: z.object({
    communityId: z.number().optional(),
  }),
})

function RouteComponent() {
  const search = Route.useSearch()

  return (
    <Layout className="items-center gap-2">
      {search?.communityId && (
        <div className="w-full">
          <ButtonLink
            variant="ghost"
            size="sm"
            className="mb-2"
            to="/communities/management/$communityId"
            params={{ communityId: String(search.communityId) }}
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
