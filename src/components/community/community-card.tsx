import { useMutation, useQueryClient } from "@tanstack/react-query"
import { joinCommunity, leaveCommunity } from "src/services/community.api"
import { communityQueries } from "src/services/queries"
import { CommunityWithMember } from "~/lib/db/schema/community"
import { ButtonLink } from "../button-link"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { Card, CardDescription, CardTitle } from "../ui/card"

export function CommunityCard({
  community,
}: {
  community: CommunityWithMember
}) {
  const queryClient = useQueryClient()

  const joinMutation = useMutation({
    mutationFn: joinCommunity,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: communityQueries.all })
    },
  })

  const leaveMutation = useMutation({
    mutationFn: leaveCommunity,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: communityQueries.all })
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
    <Card className="flex justify-between items-center p-4 gap-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={community.logoUrl || ""} alt={community.name} />
          <AvatarFallback>{community.name.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-lg">{community.name}</CardTitle>
          {community.description && (
            <CardDescription>{community.description}</CardDescription>
          )}
          {community.homeUrl && (
            <CardDescription className="text-blue-500 hover:underline">
              <a
                href={community.homeUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {community.homeUrl}
              </a>
            </CardDescription>
          )}
        </div>
      </div>
      <div>
        {community.isMember && (
          <ButtonLink
            className="mr-2"
            to={`/communities/management/$communityId`}
            params={{ communityId: community.id.toString() }}
          >
            Manage
          </ButtonLink>
        )}
        <Button
          onClick={() => handleJoinToggle(community.id, community.isMember)}
          variant={community.isMember ? "outline" : "default"}
          disabled={joinMutation.isPending || leaveMutation.isPending}
        >
          {community.isMember ? "Leave" : "Join"}
        </Button>
      </div>
    </Card>
  )
}
