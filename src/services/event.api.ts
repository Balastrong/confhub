import { createServerFn } from "@tanstack/react-start"
import {
  and,
  arrayOverlaps,
  eq,
  gt,
  ilike,
  inArray,
  lt,
  ne,
  or,
} from "drizzle-orm"
import { z } from "zod"
import { db } from "~/lib/db"
import { eventTable, usersInCommunityTable } from "~/lib/db/schema"
import { CreateEventSchema, EventFiltersSchema } from "./event.schema"
import { userRequiredMiddleware } from "./auth.api"
import { formatDate } from "~/lib/date"
import { generateSlug } from "~/lib/utils"

export const getEvents = createServerFn()
  .inputValidator(EventFiltersSchema)
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

    return await db
      .select()
      .from(eventTable)
      .where(whereCondition)
      .orderBy(eventTable.date)
      .limit(data.limit || 20)
  })

export const getEvent = createServerFn()
  .inputValidator(
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

export const getEventBySlug = createServerFn()
  .inputValidator(
    z.object({
      slug: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const [event] = await db
      .select()
      .from(eventTable)
      .where(eq(eventTable.slug, data.slug))
      .limit(1)

    return event
  })

export const upsertEvent = createServerFn()
  .inputValidator(CreateEventSchema)
  .middleware([userRequiredMiddleware])
  .handler(async ({ data, context: { userSession } }) => {
    const { id, ...eventData } = data

    if (id == null) {
      const slug = generateSlug(data.name, true)

      const [newEvent] = await db
        .insert(eventTable)
        .values({
          ...eventData,
          slug,
        })
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

export const getSimilarEvents = createServerFn()
  .inputValidator(
    z.object({
      eventId: z.number(),
      limit: z.number().min(1).max(10).default(3),
    }),
  )
  .handler(async ({ data }) => {
    const [currentEvent] = await db
      .select()
      .from(eventTable)
      .where(eq(eventTable.id, data.eventId))

    if (!currentEvent) {
      return []
    }

    // Score-based similarity search
    // We'll fetch events and score them based on:
    // 1. Shared tags (highest priority)
    // 2. Same country

    const filters = [
      eq(eventTable.draft, false),
      ne(eventTable.id, data.eventId), // Exclude current event
    ]

    // Add condition to find events with overlapping tags OR same country
    const hasTags = currentEvent.tags && currentEvent.tags.length > 0
    const hasCountry = currentEvent.country != null

    if (hasTags && hasCountry) {
      filters.push(
        or(
          arrayOverlaps(eventTable.tags, currentEvent.tags!),
          eq(eventTable.country, currentEvent.country!),
        )!,
      )
    } else if (hasTags) {
      filters.push(arrayOverlaps(eventTable.tags, currentEvent.tags!))
    } else if (hasCountry) {
      filters.push(eq(eventTable.country, currentEvent.country!))
    }

    const whereCondition = filters.length > 0 ? and(...filters) : undefined

    const similarEvents = await db
      .select()
      .from(eventTable)
      .where(whereCondition)
      .orderBy(eventTable.date)
      .limit(50) // Fetch more than needed for scoring

    // Score events based on similarity
    const now = new Date()
    const scoredEvents = similarEvents
      .map((event) => {
        let score = 0

        // Score for shared tags (3 points per tag)
        if (currentEvent.tags && event.tags) {
          const sharedTags = currentEvent.tags.filter((tag) =>
            event.tags?.includes(tag),
          )
          score += sharedTags.length * 3
        }

        // Score for same country (2 points)
        if (currentEvent.country && event.country === currentEvent.country) {
          score += 2
        }

        // Bonus for future events (5 points)
        const eventDate = new Date(event.dateEnd || event.date)
        if (eventDate > now) {
          score += 5
        }

        return { event, score }
      })
      .filter((item) => item.score > 0) // Only include events with some similarity
      .sort((a, b) => b.score - a.score) // Sort by score descending
      .slice(0, data.limit) // Take top N
      .map((item) => item.event)

    return scoredEvents
  })
