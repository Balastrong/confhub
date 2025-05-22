import { createServerFn } from "@tanstack/react-start"
import { and, eq, getTableColumns, sql } from "drizzle-orm"
import { z } from "zod"
import { db } from "~/lib/db"
import {
  communityTable,
  usersInCommunityTable,
} from "~/lib/db/schema/community"
import { userMiddleware, userRequiredMiddleware } from "./auth.api"
import {
  CommunityFiltersSchema,
  CreateCommunitySchema,
  JoinCommunitySchema,
  UpdateCommunitySchema,
} from "./community.schema"

export const createCommunity = createServerFn()
  .validator(CreateCommunitySchema)
  .handler(async ({ data }) => {
    const [community] = await db.insert(communityTable).values(data).returning()

    return community
  })

const isMemberQuery = (userId?: string) =>
  userId
    ? sql<boolean>`exists (
    select 1 from ${usersInCommunityTable}
    where ${usersInCommunityTable.userId} = ${userId}
    and ${usersInCommunityTable.communityId} = ${communityTable.id}
  )`
    : sql<boolean>`false`

export const getCommunities = createServerFn()
  .validator(CommunityFiltersSchema)
  .middleware([userMiddleware])
  .handler(async ({ data, context: { authData } }) => {
    const userId = authData?.user?.id

    return await db
      .select({
        ...getTableColumns(communityTable),
        isMember: isMemberQuery(userId),
      })
      .from(communityTable)
      .where(data.ownCommunitiesOnly ? isMemberQuery(userId) : undefined)
      .orderBy(communityTable.name)
  })

export const getCommunity = createServerFn()
  .validator(z.object({ id: z.number() }))
  .middleware([userMiddleware])
  .handler(async ({ data, context: { authData } }) => {
    const [community] = await db
      .select({
        ...getTableColumns(communityTable),
        isMember: isMemberQuery(authData?.user.id),
      })
      .from(communityTable)
      .where(eq(communityTable.id, data.id))
      .limit(1)

    if (!community) {
      throw new Error("Community not found")
    }

    return community
  })

export const joinCommunity = createServerFn()
  .validator(JoinCommunitySchema)
  .middleware([userRequiredMiddleware])
  .handler(async ({ data, context: { authData } }) => {
    await db.insert(usersInCommunityTable).values({
      userId: authData.user.id,
      communityId: data.communityId,
    })
  })

export const leaveCommunity = createServerFn()
  .validator(JoinCommunitySchema)
  .middleware([userRequiredMiddleware])
  .handler(async ({ data, context: { authData } }) => {
    await db
      .delete(usersInCommunityTable)
      .where(
        and(
          eq(usersInCommunityTable.userId, authData.user.id),
          eq(usersInCommunityTable.communityId, data.communityId),
        ),
      )
  })

export const updateCommunity = createServerFn()
  .validator(UpdateCommunitySchema)
  .handler(async ({ data }) => {
    const { id, ...communityData } = data
    const [community] = await db
      .update(communityTable)
      .set(communityData)
      .where(eq(communityTable.id, id))
      .returning()

    return community
  })
