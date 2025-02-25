import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { ButtonLink } from "./button-link"
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"
import { Button } from "./ui/button"
import { Card, CardTitle, CardDescription } from "./ui/card"
import { joinCommunity, leaveCommunity } from "~/services/community.api"
import { communityQueries } from "~/services/queries"

export function CommunityList() {
  const queryClient = useQueryClient()
  const { data: communities } = useSuspenseQuery(communityQueries.list())

  const joinMutation = useMutation({
    mutationFn: (data: Parameters<typeof joinCommunity>[0]) =>
      joinCommunity(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: communityQueries.all })
    },
  })

  const leaveMutation = useMutation({
    mutationFn: (data: Parameters<typeof leaveCommunity>[0]) =>
      leaveCommunity(data),
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
    <ul className="space-y-2 min-w-[40%] max-w-[90%]">
      {communities?.map((community) => (
        <Card
          key={community.id}
          className="flex justify-between items-center p-4 gap-4"
        >
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={community.logoUrl || ""} alt={community.name} />
              <AvatarFallback>{community.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{community.name}</CardTitle>
              {community.location && (
                <CardDescription>{community.location}</CardDescription>
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
      ))}
    </ul>
  )
}
