import { and, eq, getTableColumns, sql } from "drizzle-orm"
import { db } from "~/lib/db"
import {
  communityTable,
  usersInCommunityTable,
} from "~/lib/db/schema/community"
import { eventTable } from "~/lib/db/schema/event"
import { generateSlug } from "~/lib/utils"
import type {
  CommunityFilters,
  CreateCommunityInput,
  UpdateCommunityInput,
} from "./schema"

function getTodayKey() {
  return new Date().toISOString().split("T")[0]
}

function isMemberQuery(userId?: string) {
  return userId
    ? sql<boolean>`exists (
        select 1 from ${usersInCommunityTable}
        where ${usersInCommunityTable.userId} = ${userId}
          and ${usersInCommunityTable.communityId} = ${communityTable.id}
      )`
    : sql<boolean>`false`
}

export type CommunityServiceDeps = {
  db: typeof db
}

export function createCommunityService(deps: CommunityServiceDeps) {
  return {
    async createCommunity(userId: string, data: CreateCommunityInput) {
      let slug = generateSlug(data.name, false)

      const sameSlugCounter = await deps.db
        .select()
        .from(communityTable)
        .where(eq(communityTable.slug, slug))
        .limit(1)

      if (sameSlugCounter.length > 0) {
        slug = generateSlug(data.name, true)
      }

      const [community] = await deps.db
        .insert(communityTable)
        .values({
          ...data,
          slug,
        })
        .returning()

      await deps.db.insert(usersInCommunityTable).values({
        userId,
        communityId: community.id,
        role: "admin",
      })

      return community
    },

    async getCommunities(filters: CommunityFilters, viewerUserId?: string) {
      const userId = filters.userId ?? viewerUserId
      const today = getTodayKey()

      return deps.db
        .select({
          ...getTableColumns(communityTable),
          memberCount: sql<number>`(
            select count(*)::int
            from ${usersInCommunityTable}
            where ${usersInCommunityTable.communityId} = ${communityTable.id}
          )`,
          upcomingEventsCount: sql<number>`(
            select count(*)::int
            from ${eventTable}
            where ${eventTable.communityId} = ${communityTable.id}
              and ${eventTable.date} >= ${today}
              and ${eventTable.draft} = false
          )`,
          isMember: sql<boolean>`${usersInCommunityTable.role} is not null`,
          userRole: usersInCommunityTable.role,
        })
        .from(communityTable)
        .leftJoin(
          usersInCommunityTable,
          and(
            eq(usersInCommunityTable.communityId, communityTable.id),
            eq(usersInCommunityTable.userId, viewerUserId || ""),
          ),
        )
        .where(filters.ownCommunitiesOnly ? isMemberQuery(userId) : undefined)
        .orderBy(communityTable.name)
    },

    async getCommunity(
      input: { id?: number; slug?: string },
      viewerUserId?: string,
    ) {
      const today = getTodayKey()

      const query = deps.db
        .select({
          ...getTableColumns(communityTable),
          isMember: sql<boolean>`${usersInCommunityTable.role} is not null`,
          upcomingEventsCount: sql<number>`(
            select count(*)::int
            from ${eventTable}
            where ${eventTable.communityId} = ${communityTable.id}
              and ${eventTable.date} >= ${today}
              and ${eventTable.draft} = false
          )`,
          userRole: usersInCommunityTable.role,
        })
        .from(communityTable)
        .leftJoin(
          usersInCommunityTable,
          and(
            eq(usersInCommunityTable.communityId, communityTable.id),
            eq(usersInCommunityTable.userId, viewerUserId || ""),
          ),
        )
        .limit(1)

      const [community] =
        input.id !== undefined
          ? await query.where(eq(communityTable.id, input.id))
          : await query.where(eq(communityTable.slug, input.slug as string))

      if (!community) {
        throw new Error("Community not found")
      }

      return community
    },

    async joinCommunity(userId: string, communityId: number) {
      await deps.db.insert(usersInCommunityTable).values({
        userId,
        communityId,
      })
    },

    async leaveCommunity(userId: string, communityId: number) {
      await deps.db
        .delete(usersInCommunityTable)
        .where(
          and(
            eq(usersInCommunityTable.userId, userId),
            eq(usersInCommunityTable.communityId, communityId),
          ),
        )
    },

    async getUserRoleInCommunity(userId: string, communityId: number) {
      const [userInCommunity] = await deps.db
        .select({
          role: usersInCommunityTable.role,
        })
        .from(usersInCommunityTable)
        .where(
          and(
            eq(usersInCommunityTable.userId, userId),
            eq(usersInCommunityTable.communityId, communityId),
          ),
        )
        .limit(1)

      return userInCommunity?.role ?? null
    },

    async updateCommunity(userId: string, data: UpdateCommunityInput) {
      const userRole = await this.getUserRoleInCommunity(userId, data.id)

      if (userRole !== "admin") {
        throw new Response(
          JSON.stringify({
            message: "You are not allowed to update this community",
          }),
          {
            status: 403,
            headers: { "content-type": "application/json" },
          },
        )
      }

      const { id, ...communityData } = data
      const [community] = await deps.db
        .update(communityTable)
        .set(communityData)
        .where(eq(communityTable.id, id))
        .returning()

      return community
    },
  }
}

export const communityService = createCommunityService({ db })
