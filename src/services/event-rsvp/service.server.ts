import { and, desc, eq, sql } from "drizzle-orm"
import { db } from "~/lib/db"
import { eventRsvpTable, eventTable } from "~/lib/db/schema"
import type { UpsertRsvp } from "./schema"

export type EventRsvpServiceDeps = {
  db: typeof db
}

export function createEventRsvpService(deps: EventRsvpServiceDeps) {
  return {
    async getMyRsvpForEvent(userId: string) {
      return async (eventId: number) => {
        const [row] = await deps.db
          .select()
          .from(eventRsvpTable)
          .where(
            and(
              eq(eventRsvpTable.eventId, eventId),
              eq(eventRsvpTable.userId, userId),
            ),
          )
          .limit(1)

        return row ?? null
      }
    },

    async findMyRsvpForEvent(userId: string | undefined, eventId: number) {
      if (!userId) {
        return null
      }

      const [row] = await deps.db
        .select()
        .from(eventRsvpTable)
        .where(
          and(
            eq(eventRsvpTable.eventId, eventId),
            eq(eventRsvpTable.userId, userId),
          ),
        )
        .limit(1)

      return row ?? null
    },

    async upsertMyRsvpForEvent(userId: string, data: UpsertRsvp) {
      const { eventId, status } = data

      const [existing] = await deps.db
        .select()
        .from(eventRsvpTable)
        .where(
          and(
            eq(eventRsvpTable.eventId, eventId),
            eq(eventRsvpTable.userId, userId),
          ),
        )
        .limit(1)

      if (existing) {
        const [updated] = await deps.db
          .update(eventRsvpTable)
          .set({ status })
          .where(
            and(
              eq(eventRsvpTable.eventId, eventId),
              eq(eventRsvpTable.userId, userId),
            ),
          )
          .returning()

        return updated
      }

      const [inserted] = await deps.db
        .insert(eventRsvpTable)
        .values({ eventId, userId, status })
        .returning()

      return inserted
    },

    async removeMyRsvpForEvent(userId: string, eventId: number) {
      await deps.db
        .delete(eventRsvpTable)
        .where(
          and(
            eq(eventRsvpTable.eventId, eventId),
            eq(eventRsvpTable.userId, userId),
          ),
        )

      return { ok: true }
    },

    async getEventRsvpCounts(eventId: number) {
      const rows = await deps.db
        .select({
          status: eventRsvpTable.status,
          count: sql<number>`count(*)::int`,
        })
        .from(eventRsvpTable)
        .where(eq(eventRsvpTable.eventId, eventId))
        .groupBy(eventRsvpTable.status)

      const counts: { going: number; interested: number; not_going: number } = {
        going: 0,
        interested: 0,
        not_going: 0,
      }

      for (const row of rows) {
        const key = row.status as keyof typeof counts
        counts[key] = row.count
      }

      return counts
    },

    async getMyRsvpEvents(userId: string) {
      return deps.db
        .select({
          id: eventTable.id,
          slug: eventTable.slug,
          name: eventTable.name,
          description: eventTable.description,
          date: eventTable.date,
          dateEnd: eventTable.dateEnd,
          eventUrl: eventTable.eventUrl,
          cfpUrl: eventTable.cfpUrl,
          cfpClosingDate: eventTable.cfpClosingDate,
          mode: eventTable.mode,
          city: eventTable.city,
          country: eventTable.country,
          tags: eventTable.tags,
          draft: eventTable.draft,
          communityId: eventTable.communityId,
          rsvpStatus: eventRsvpTable.status,
          rsvpCreatedAt: eventRsvpTable.createdAt,
        })
        .from(eventRsvpTable)
        .innerJoin(eventTable, eq(eventRsvpTable.eventId, eventTable.id))
        .where(eq(eventRsvpTable.userId, userId))
        .orderBy(desc(eventRsvpTable.createdAt))
    },
  }
}

export const eventRsvpService = createEventRsvpService({ db })
