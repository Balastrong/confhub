import { createServerFn } from "@tanstack/react-start"
import { and, asc, eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "~/lib/db"
import { eventCommentTable, userTable } from "~/lib/db/schema"
import { userRequiredMiddleware } from "./auth.api"
import {
  CreateEventCommentSchema,
  DeleteEventCommentSchema,
} from "./event-comment.schema"
import { randomUUID } from "node:crypto"

export const listEventComments = createServerFn()
  .inputValidator(
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
  .inputValidator(CreateEventCommentSchema)
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

export const deleteEventComment = createServerFn()
  .inputValidator(DeleteEventCommentSchema)
  .middleware([userRequiredMiddleware])
  .handler(async ({ data, context: { userSession } }) => {
    // Ensure the comment exists and belongs to the current user
    const [row] = await db
      .select({ id: eventCommentTable.id, eventId: eventCommentTable.eventId })
      .from(eventCommentTable)
      .where(
        and(
          eq(eventCommentTable.id, data.id),
          eq(eventCommentTable.userId, userSession.user.id),
        ),
      )

    if (!row) {
      // Either not found or not owned by user
      throw new Response("Not found", { status: 404 })
    }

    // Disallow deleting a comment that has replies (due to FK constraints)
    const child = await db
      .select({ id: eventCommentTable.id })
      .from(eventCommentTable)
      .where(eq(eventCommentTable.parentId, data.id))
      .limit(1)

    if (child.length > 0) {
      throw new Response("Cannot delete a comment that has replies.", {
        status: 400,
      })
    }

    await db.delete(eventCommentTable).where(eq(eventCommentTable.id, data.id))

    return { id: data.id, eventId: row.eventId }
  })
