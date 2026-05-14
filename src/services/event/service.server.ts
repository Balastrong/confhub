import { and, arrayOverlaps, eq, gt, ilike, inArray, lt, or } from "drizzle-orm"
import { db } from "~/lib/db"
import { eventTable, usersInCommunityTable } from "~/lib/db/schema"
import { formatDate } from "~/lib/date"
import { generateSlug } from "~/lib/utils"
import type { CreateEvent, EventFilters } from "./schema"

export type EventServiceDeps = {
  db: typeof db
}

export function createEventService(deps: EventServiceDeps) {
  return {
    async getEvents(data: EventFilters) {
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
        if (Array.isArray(data.communityId)) {
          filters.push(inArray(eventTable.communityId, data.communityId))
        } else {
          filters.push(eq(eventTable.communityId, data.communityId))
        }
      }

      if (data.startDate || data.startDate === undefined) {
        const startDate = data.startDate || formatDate(new Date())
        filters.push(
          or(gt(eventTable.date, startDate), gt(eventTable.dateEnd, startDate)),
        )
      }

      if (data.endDate) {
        filters.push(
          or(
            lt(eventTable.date, data.endDate),
            lt(eventTable.dateEnd, data.endDate),
          ),
        )
      }

      const whereCondition = filters.length > 0 ? and(...filters) : undefined

      return deps.db
        .select()
        .from(eventTable)
        .where(whereCondition)
        .orderBy(eventTable.date)
        .limit(data.limit || 20)
    },

    async getEvent(id: number) {
      const [event] = await deps.db
        .select()
        .from(eventTable)
        .where(eq(eventTable.id, id))

      return event
    },

    async getEventBySlug(slug: string) {
      const [event] = await deps.db
        .select()
        .from(eventTable)
        .where(eq(eventTable.slug, slug))
        .limit(1)

      return event
    },

    async upsertEvent(userId: string, data: CreateEvent) {
      const { id, ...eventData } = data

      if (id == null) {
        const slug = generateSlug(data.name, true)

        const [newEvent] = await deps.db
          .insert(eventTable)
          .values({
            ...eventData,
            slug,
          })
          .returning()

        return newEvent
      }

      const [event] = await deps.db
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

      const userInCommunity = await deps.db
        .select()
        .from(usersInCommunityTable)
        .where(
          and(
            eq(usersInCommunityTable.userId, userId),
            eq(usersInCommunityTable.communityId, event.communityId),
          ),
        )

      if (userInCommunity.length === 0) {
        throw unauthorized()
      }

      if (eventData.communityId !== event.communityId) {
        throw unauthorized()
      }

      const [updatedEvent] = await deps.db
        .update(eventTable)
        .set(eventData)
        .where(eq(eventTable.id, id))
        .returning()

      return updatedEvent
    },
  }
}

export const eventService = createEventService({ db })
