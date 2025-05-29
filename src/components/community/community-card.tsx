import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { toast } from "sonner"
import { joinCommunity, leaveCommunity } from "src/services/community.api"
import { communityQueries } from "src/services/queries"
import { useAuthentication } from "~/lib/auth/client"
import { CommunityWithMember } from "~/lib/db/schema/community"
import { ButtonLink } from "../button-link"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { Card, CardDescription, CardTitle } from "../ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"

export function CommunityCard({
  community,
}: {
  community: CommunityWithMember
}) {
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuthentication()
  const navigate = useNavigate()
  const [showLeaveDialog, setShowLeaveDialog] = useState(false)

  const joinMutation = useMutation({
    mutationFn: joinCommunity,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: communityQueries.all })
      toast.success(`You're now a member of ${community.name}`)
    },
  })

  const leaveMutation = useMutation({
    mutationFn: leaveCommunity,
    onSuccess: async (r) => {
      r
      await queryClient.invalidateQueries({ queryKey: communityQueries.all })
      setShowLeaveDialog(false)
      toast.success(`You're no longer part of ${community.name}`)
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
    setShowLeaveDialog(true)
  }

  const confirmLeave = () => {
    leaveMutation.mutate({ data: { communityId: community.id } })
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
        <ButtonLink
          className="mr-2"
          to={`/communities/$communityId`}
          variant={"secondary"}
          params={{ communityId: community.id.toString() }}
        >
          View
        </ButtonLink>
        {community.isMember ? (
          <Button
            onClick={() => handleLeave(community.id)}
            variant={"outline"}
            disabled={leaveMutation.isPending}
          >
            Leave
          </Button>
        ) : (
          <Button
            onClick={() => handleJoin(community.id)}
            disabled={joinMutation.isPending}
          >
            Join
          </Button>
        )}
      </div>

      <Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave Community</DialogTitle>
            <DialogDescription>
              Are you sure you want to leave "{community.name}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLeaveDialog(false)}
              disabled={leaveMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmLeave}
              disabled={leaveMutation.isPending}
            >
              {leaveMutation.isPending ? "Leaving..." : "Leave Community"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
