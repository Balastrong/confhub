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
    <Card className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
        <Avatar className="h-12 w-12 shrink-0">
          <AvatarImage src={community.logoUrl || ""} alt={community.name} />
          <AvatarFallback>{community.name.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="space-y-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-lg leading-snug line-clamp-2 break-words">
              {community.name}
            </CardTitle>
            {community.isMember && (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800 border-green-200 text-[10px] sm:text-xs py-0.5"
              >
                ✓ Member
              </Badge>
            )}
            {community.verified && (
              <Badge variant="accent" className="text-[10px] sm:text-xs py-0.5">
                ✓ Verified
              </Badge>
            )}
          </div>
          {community.description && (
            <CardDescription className="line-clamp-2">
              {community.description}
            </CardDescription>
          )}
          {community.homeUrl && (
            <CardDescription className="text-blue-500 hover:underline truncate">
              <a
                href={community.homeUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {community.homeUrl}
              </a>
            </CardDescription>
          )}
          <CardDescription className="text-xs sm:text-sm">
            {community.upcomingEventsCount !== undefined && (
              <>
                {community.upcomingEventsCount} upcoming{" "}
                {community.upcomingEventsCount === 1 ? "event" : "events"}
                {" • "}
              </>
            )}
            {community.memberCount} {""}
            {community.memberCount === 1 ? "member" : "members"}
          </CardDescription>
        </div>
      </div>
      <div className="sm:self-stretch sm:flex sm:flex-col sm:justify-center w-full sm:w-auto">
        <ButtonLink
          className="w-full sm:w-auto"
          to={`/communities/$communitySlug`}
          variant={"accent"}
          params={{ communitySlug: community.slug }}
        >
          View
        </ButtonLink>
      </div>
    </Card>
  )
}
