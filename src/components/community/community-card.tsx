import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { joinCommunity, leaveCommunity } from "src/services/community.api"
import { communityQueries } from "src/services/queries"
import { useAuthentication } from "~/lib/auth/client"
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
  const { isAuthenticated } = useAuthentication()
  const navigate = useNavigate()

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

  const handleJoin = (communityId: number) => {
    if (!isAuthenticated) {
      toast.error("You need to be logged in to join a community.", {
        action: {
          label: "Sign in",
          onClick: () => navigate({ to: "/sign-in" }),
        },
      })
      return
    }

    joinMutation.mutate({ data: { communityId } })
  }

  const handleLeave = (communityId: number) => {
    leaveMutation.mutate({ data: { communityId } })
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
          <CardDescription>
            {community.memberCount}{" "}
            {community.memberCount === 1 ? "member" : "members"}
          </CardDescription>
        </div>
      </div>
      <div>
        {community.isMember ? (
          <>
            <ButtonLink
              className="mr-2"
              to={`/communities/management/$communityId`}
              params={{ communityId: community.id.toString() }}
            >
              Manage
            </ButtonLink>
            <Button
              onClick={() => handleLeave(community.id)}
              variant={"outline"}
              disabled={leaveMutation.isPending}
            >
              Leave
            </Button>
          </>
        ) : (
          <Button
            onClick={() => handleJoin(community.id)}
            disabled={joinMutation.isPending}
          >
            Join
          </Button>
        )}
      </div>
    </Card>
  )
}
