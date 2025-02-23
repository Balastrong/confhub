import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { ButtonLink } from "~/components/button-link"
import { Layout } from "~/components/layout"
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import { Card, CardTitle, CardDescription } from "~/components/ui/card"
import { joinCommunity, leaveCommunity } from "~/services/community.api"
import { communityQueries } from "~/services/queries"

export const Route = createFileRoute("/community/")({
  component: RouteComponent,
})

function RouteComponent() {
  const queryClient = useQueryClient()
  const { data: communities } = useSuspenseQuery(communityQueries.list())

  const joinMutation = useMutation({
    mutationFn: joinCommunity,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["communities"] })
    },
  })

  const leaveMutation = useMutation({
    mutationFn: leaveCommunity,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["communities"] })
    },
  })

  const handleJoinToggle = async (communityId: number, isMember: boolean) => {
    if (isMember) {
      leaveMutation.mutate({ data: { communityId } })
    } else {
      joinMutation.mutate({ data: { communityId } })
    }
  }

  return (
    <Layout className="items-center gap-2">
      <h1 className="text-2xl font-bold">Communities</h1>
      <ul className="space-y-2 min-w-[40%]">
        {communities?.map((community) => (
          <Card
            key={community.id}
            className="flex justify-between items-center p-4"
          >
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={community.logoUrl || ""}
                  alt={community.name}
                />
                <AvatarFallback>
                  {community.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{community.name}</CardTitle>
                {community.location && (
                  <CardDescription>{community.location}</CardDescription>
                )}
              </div>
            </div>
            <div>
              {community.isMember && (
                <ButtonLink
                  className="mr-2"
                  to={`/community/management/$communityId`}
                  params={{ communityId: community.id.toString() }}
                >
                  Admin
                </ButtonLink>
              )}
              <Button
                onClick={() =>
                  handleJoinToggle(community.id, community.isMember)
                }
                variant={community.isMember ? "outline" : "default"}
                disabled={joinMutation.isPending || leaveMutation.isPending}
              >
                {community.isMember ? "Leave" : "Join"}
              </Button>
            </div>
          </Card>
        ))}
      </ul>
    </Layout>
  )
}
