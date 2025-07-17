import { CommunityWithMember } from "~/lib/db/schema/community"
import { ButtonLink } from "../button-link"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { Card, CardDescription, CardTitle } from "../ui/card"

export function CommunityCard({
  community,
}: {
  community: CommunityWithMember
}) {
  return (
    <Card className="flex justify-between items-center p-4 gap-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={community.logoUrl || ""} alt={community.name} />
          <AvatarFallback>{community.name.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{community.name}</CardTitle>
            {community.verified && (
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-800 border-blue-200"
              >
                ✓ Verified
              </Badge>
            )}
          </div>
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
            {community.upcomingEventsCount !== undefined && (
              <>
                {community.upcomingEventsCount} upcoming{" "}
                {community.upcomingEventsCount === 1 ? "event" : "events"}
                {" • "}
              </>
            )}
            {community.memberCount}{" "}
            {community.memberCount === 1 ? "member" : "members"}
          </CardDescription>
        </div>
      </div>
      <div>
        <ButtonLink
          className="mr-2"
          to={`/communities/$communitySlug`}
          variant={"secondary"}
          params={{ communitySlug: community.slug }}
        >
          View
        </ButtonLink>
      </div>
    </Card>
  )
}
