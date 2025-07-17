import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { communityQueries } from "~/services/queries"

// TODO: I hope I won't need this
export function useNavigateToCommunity(communityId: number) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  async function navigateToCommunity() {
    const community = await queryClient.ensureQueryData(
      communityQueries.detail(communityId),
    )

    queryClient.setQueryData(
      [...communityQueries.all, "detailBySlug", community.slug],
      community,
    )

    navigate({
      to: `/communities/${community.slug}`,
      params: { communitySlug: community.slug },
    })
  }

  return navigateToCommunity
}
