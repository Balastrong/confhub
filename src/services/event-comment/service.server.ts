import { randomUUID } from "node:crypto"
import { and, asc, eq } from "drizzle-orm"
import { db } from "~/lib/db"
import { eventCommentTable, userTable } from "~/lib/db/schema"
import type { CreateEventComment, DeleteEventComment } from "./schema"

export type EventCommentServiceDeps = {
  db: typeof db
}

export function createEventCommentService(deps: EventCommentServiceDeps) {
  return {
    async listEventComments(eventId: number) {
      return deps.db
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
        .where(eq(eventCommentTable.eventId, eventId))
        .orderBy(asc(eventCommentTable.createdAt))
    },

    async createEventComment(userId: string, data: CreateEventComment) {
      const [inserted] = await deps.db
        .insert(eventCommentTable)
        .values({
          id: randomUUID(),
          eventId: data.eventId,
          content: data.content,
          rating: data.rating,
          parentId: data.parentId,
          userId,
        })
        .returning()

      return inserted
    },

    async deleteEventComment(userId: string, data: DeleteEventComment) {
      const [row] = await deps.db
        .select({
          id: eventCommentTable.id,
          eventId: eventCommentTable.eventId,
        })
        .from(eventCommentTable)
        .where(
          and(
            eq(eventCommentTable.id, data.id),
            eq(eventCommentTable.userId, userId),
          ),
        )

      if (!row) {
        throw new Response("Not found", { status: 404 })
      }

      const child = await deps.db
        .select({ id: eventCommentTable.id })
        .from(eventCommentTable)
        .where(eq(eventCommentTable.parentId, data.id))
        .limit(1)

      if (child.length > 0) {
        throw new Response("Cannot delete a comment that has replies.", {
          status: 400,
        })
      }

      await deps.db
        .delete(eventCommentTable)
        .where(eq(eventCommentTable.id, data.id))

      return { id: data.id, eventId: row.eventId }
    },
  }
}

export const eventCommentService = createEventCommentService({ db })
