import { createServerFn } from "@tanstack/react-start"
import { and, arrayOverlaps, eq, gt, ilike, inArray, or } from "drizzle-orm"
import { z } from "zod"
import { db } from "~/lib/db"
import { eventTable, usersInCommunityTable } from "~/lib/db/schema"
import { CreateEventSchema, EventFiltersSchema } from "./event.schema"
import { userRequiredMiddleware } from "./auth.api"

export const getEvents = createServerFn()
  .validator(EventFiltersSchema)
  .handler(async ({ data }) => {
    const filters = []

    if (data.communityDraft == undefined) {
      filters.push(eq(eventTable.draft, false))
    } else {
      filters.push(eq(eventTable.draft, data.communityDraft))
    }

    if (data.query) {
      filters.push(ilike(eventTable.name, `%${data.query}%`))
    }

    if (data.modes && data.modes.length > 0) {
      filters.push(inArray(eventTable.mode, data.modes))
    }

    if (data.tags && data.tags.length > 0) {
      filters.push(arrayOverlaps(eventTable.tags, data.tags))
    }

    if (data.country) {
      filters.push(eq(eventTable.country, data.country))
    }

    if (data.hasCfpOpen) {
      filters.push(gt(eventTable.cfpClosingDate, new Date().toISOString()))
    }

    if (data.communityId) {
      filters.push(eq(eventTable.communityId, data.communityId))
    }

    if (data.startDate) {
      filters.push(
        or(
          gt(eventTable.date, data.startDate),
          gt(eventTable.dateEnd, data.startDate),
        ),
      )
    }

    const whereCondition = filters.length > 0 ? and(...filters) : undefined

    return await db
      .select()
      .from(eventTable)
      .where(whereCondition)
      .orderBy(eventTable.date)
  })

export const getEvent = createServerFn()
  .validator(
    z.object({
      id: z.number(),
    }),
  )
  .handler(async ({ data }) => {
    const [event] = await db
      .select()
      .from(eventTable)
      .where(eq(eventTable.id, data.id))

    return event
  })

export const upsertEvent = createServerFn()
  .validator(CreateEventSchema)
  .middleware([userRequiredMiddleware])
  .handler(async ({ data, context: { userSession } }) => {
    const { id, ...eventData } = data

    if (id == null) {
      const [newEvent] = await db
        .insert(eventTable)
        .values(eventData)
        .returning()

      return newEvent
    } else {
      const [event] = await db
        .select()
        .from(eventTable)
        .where(eq(eventTable.id, id))

      if (!event) {
        throw new Error("Event not found")
      }

      const unauthorized = () => {
        throw new Error("You can only edit events from your community!")
      }

      if (!event.communityId) {
        throw unauthorized()
      }

      // Check if the user is in the event's community
      const userInCommunity = await db
        .select()
        .from(usersInCommunityTable)
        .where(
          and(
            eq(usersInCommunityTable.userId, userSession.user.id),
            eq(usersInCommunityTable.communityId, event.communityId),
          ),
        )

      if (userInCommunity.length === 0) {
        throw unauthorized()
      }

      // Check if the provided communityId matches the event's communityId
      if (eventData.communityId !== event.communityId) {
        throw unauthorized()
      }

      const [updatedEvent] = await db
        .update(eventTable)
        .set(eventData)
        .where(eq(eventTable.id, id))
        .returning()

      return updatedEvent
    }
  })
