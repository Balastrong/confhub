import { createServerFn } from "@tanstack/react-start"
import { and, asc, eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "~/lib/db"
import { eventCommentTable, userTable } from "~/lib/db/schema"
import { userRequiredMiddleware } from "./auth.api"
import { CreateEventCommentSchema } from "./event-comment.schema"
import { randomUUID } from "node:crypto"

export const listEventComments = createServerFn()
  .validator(
    z.object({
      eventId: z.number(),
    }),
  )
  .handler(async ({ data }) => {
    const rows = await db
      .select({
        id: eventCommentTable.id,
        eventId: eventCommentTable.eventId,
        userId: eventCommentTable.userId,
        content: eventCommentTable.content,
        rating: eventCommentTable.rating,
        parentId: eventCommentTable.parentId,
        createdAt: eventCommentTable.createdAt,
        updatedAt: eventCommentTable.updatedAt,
        authorName: userTable.name,
        authorImage: userTable.image,
      })
      .from(eventCommentTable)
      .leftJoin(userTable, eq(userTable.id, eventCommentTable.userId))
      .where(eq(eventCommentTable.eventId, data.eventId))
      .orderBy(asc(eventCommentTable.createdAt))

    return rows
  })

export const createEventComment = createServerFn()
  .validator(CreateEventCommentSchema)
  .middleware([userRequiredMiddleware])
  .handler(async ({ data, context: { userSession } }) => {
    const [inserted] = await db
      .insert(eventCommentTable)
      .values({
        id: randomUUID(),
        eventId: data.eventId,
        content: data.content,
        rating: data.rating,
        parentId: data.parentId,
        userId: userSession.user.id,
      })
      .returning()

    return inserted
  })
