import { createServerFn, json } from "@tanstack/react-start"
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
import { setResponseStatus } from "@tanstack/react-start/server"

export const createCommunity = createServerFn()
  .validator(CreateCommunitySchema)
  .middleware([userRequiredMiddleware])
  .handler(async ({ data, context: { userSession } }) => {
    const [community] = await db.insert(communityTable).values(data).returning()

    await db.insert(usersInCommunityTable).values({
      userId: userSession.user.id,
      communityId: community.id,
      role: "admin",
    })

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
  .handler(async ({ data, context: { userSession } }) => {
    const userId = userSession?.user?.id

    return await db
      .select({
        ...getTableColumns(communityTable),
        memberCount: sql<number>`(
          select count(*)::int
          from ${usersInCommunityTable}
          where ${usersInCommunityTable.communityId} = ${communityTable.id}
        )`,
        isMember: isMemberQuery(userId),
      })
      .from(communityTable)
      .where(data.ownCommunitiesOnly ? isMemberQuery(userId) : undefined)
      .orderBy(communityTable.name)
  })

export const getCommunity = createServerFn()
  .validator(z.object({ id: z.number() }))
  .middleware([userMiddleware])
  .handler(async ({ data, context: { userSession } }) => {
    const [community] = await db
      .select({
        ...getTableColumns(communityTable),
        isMember: isMemberQuery(userSession?.user.id),
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
  .handler(async ({ data, context: { userSession } }) => {
    await db.insert(usersInCommunityTable).values({
      userId: userSession.user.id,
      communityId: data.communityId,
    })
  })

export const leaveCommunity = createServerFn()
  .validator(JoinCommunitySchema)
  .middleware([userRequiredMiddleware])
  .handler(async ({ data, context: { userSession } }) => {
    await db
      .delete(usersInCommunityTable)
      .where(
        and(
          eq(usersInCommunityTable.userId, userSession.user.id),
          eq(usersInCommunityTable.communityId, data.communityId),
        ),
      )
  })

export const updateCommunity = createServerFn()
  .validator(UpdateCommunitySchema)
  .middleware([userRequiredMiddleware])
  .handler(async ({ data, context: { userSession } }) => {
    const userRole = await getUserRoleInCommunity({
      data: { communityId: data.id },
    })

    if (userRole !== "admin") {
      throw json(
        { message: "You are not allowed to update this community" },
        { status: 403 },
      )
    }

    const { id, ...communityData } = data
    const [community] = await db
      .update(communityTable)
      .set(communityData)
      .where(eq(communityTable.id, id))
      .returning()

    return community
  })

export const getUserRoleInCommunity = createServerFn()
  .validator(z.object({ communityId: z.number() }))
  .middleware([userRequiredMiddleware])
  .handler(async ({ data, context: { userSession } }) => {
    const [userInCommunity] = await db
      .select({
        role: usersInCommunityTable.role,
      })
      .from(usersInCommunityTable)
      .where(
        and(
          eq(usersInCommunityTable.userId, userSession.user.id),
          eq(usersInCommunityTable.communityId, data.communityId),
        ),
      )
      .limit(1)

    if (!userInCommunity || !userInCommunity.role) {
      setResponseStatus(404)
      return null
    }

    return userInCommunity.role
  })
