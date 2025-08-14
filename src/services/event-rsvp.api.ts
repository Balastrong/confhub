import { createServerFn } from "@tanstack/react-start"
import { and, eq, sql } from "drizzle-orm"
import { db } from "~/lib/db"
import { eventRsvpTable } from "~/lib/db/schema"
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
