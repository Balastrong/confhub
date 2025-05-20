import { useEffect, useState } from "react"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Card, CardDescription, CardTitle } from "../ui/card"
import { Skeleton } from "../ui/skeleton"

export const CommunityCardSkeleton = () => {
  return (
    <Card className="flex justify-between items-center p-4 gap-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarFallback>
            <Skeleton className="h-full w-full" />
          </AvatarFallback>
        </Avatar>
        <div>
          <Skeleton className="h-6 w-32 mb-2 text-2xl" />
          <Skeleton className="h-4 w-24 mt-1" />
          <Skeleton className="h-4 w-12 mt-1" />
        </div>
      </div>
      <div>
        <Skeleton className="h-10 w-20 mr-2 inline-block" />
        <Skeleton className="h-10 w-16 inline-block" />
      </div>
    </Card>
  )
}

export const CommunityCardSkeletons = () => {
  return (
    <ul className="space-y-2 min-w-[40%] max-w-[90%]">
      {Array.from({ length: 2 }).map((_, index) => (
        <CommunityCardSkeleton key={index} />
      ))}
    </ul>
  )
}
