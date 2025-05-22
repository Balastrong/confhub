import { createServerFn } from "@tanstack/react-start"
import { and, arrayOverlaps, eq, gt, ilike, inArray, or } from "drizzle-orm"
import { z } from "zod"
import { db } from "~/lib/db"
import { eventTable } from "~/lib/db/schema"
import { CreateEventSchema, EventFiltersSchema } from "./event.schema"

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
  .handler(async ({ data }) => {
    const { id, ...eventData } = data

    if (id == null) {
      await db.insert(eventTable).values(eventData)
    } else {
      await db.update(eventTable).set(eventData).where(eq(eventTable.id, id))
    }
  })
