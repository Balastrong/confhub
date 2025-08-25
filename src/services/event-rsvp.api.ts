import { createServerFn } from "@tanstack/react-start"
import { and, eq, sql, desc } from "drizzle-orm"
import { db } from "~/lib/db"
import { eventRsvpTable, eventTable } from "~/lib/db/schema"
import { GetRsvpSchema, UpsertRsvpSchema } from "./event-rsvp.schema"
import { userRequiredMiddleware, userMiddleware } from "./auth.api"

export const getMyRsvpForEvent = createServerFn()
  .validator(GetRsvpSchema)
  .middleware([userMiddleware])
  .handler(async ({ data, context: { userSession } }) => {
    if (!userSession) return null

    const [row] = await db
      .select()
      .from(eventRsvpTable)
      .where(
        and(
          eq(eventRsvpTable.eventId, data.eventId),
          eq(eventRsvpTable.userId, userSession.user.id),
        ),
      )
      .limit(1)

    return row ?? null
  })

export const upsertMyRsvpForEvent = createServerFn()
  .validator(UpsertRsvpSchema)
  .middleware([userRequiredMiddleware])
  .handler(async ({ data, context: { userSession } }) => {
    const { eventId, status } = data

    // Upsert behavior: try update first, else insert
    const [existing] = await db
      .select()
      .from(eventRsvpTable)
      .where(
        and(
          eq(eventRsvpTable.eventId, eventId),
          eq(eventRsvpTable.userId, userSession.user.id),
        ),
      )
      .limit(1)

    if (existing) {
      const [updated] = await db
        .update(eventRsvpTable)
        .set({ status })
        .where(
          and(
            eq(eventRsvpTable.eventId, eventId),
            eq(eventRsvpTable.userId, userSession.user.id),
          ),
        )
        .returning()
      return updated
    }

    const [inserted] = await db
      .insert(eventRsvpTable)
      .values({ eventId, userId: userSession.user.id, status })
      .returning()

    return inserted
  })

export const removeMyRsvpForEvent = createServerFn()
  .validator(GetRsvpSchema)
  .middleware([userRequiredMiddleware])
  .handler(async ({ data, context: { userSession } }) => {
    await db
      .delete(eventRsvpTable)
      .where(
        and(
          eq(eventRsvpTable.eventId, data.eventId),
          eq(eventRsvpTable.userId, userSession.user.id),
        ),
      )

    return { ok: true }
  })

export const getEventRsvpCounts = createServerFn()
  .validator(GetRsvpSchema)
  .handler(async ({ data }) => {
    const rows = await db
      .select({
        status: eventRsvpTable.status,
        count: sql<number>`count(*)::int`,
      })
      .from(eventRsvpTable)
      .where(eq(eventRsvpTable.eventId, data.eventId))
      .groupBy(eventRsvpTable.status)

    const counts: { going: number; interested: number; not_going: number } = {
      going: 0,
      interested: 0,
      not_going: 0,
    }

    for (const r of rows) {
      const key = r.status as keyof typeof counts
      counts[key] = r.count
    }

    return counts
  })

export const getMyRsvpEvents = createServerFn()
  .middleware([userRequiredMiddleware])
  .handler(async ({ context: { userSession } }) => {
    const rows = await db
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
      .where(eq(eventRsvpTable.userId, userSession.user.id))
      .orderBy(desc(eventRsvpTable.createdAt))

    return rows
  })
