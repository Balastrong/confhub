import { relations } from "drizzle-orm"
import {
  AnyPgColumn,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"
import { eventTable } from "./event"
import { userTable } from "./user"

export const eventCommentTable = pgTable(
  "event_comments",
  {
    id: uuid().primaryKey(),
    eventId: integer("event_id")
      .notNull()
      .references(() => eventTable.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    content: text().notNull(),
    rating: integer(),
    parentId: uuid("parent_id").references(
      (): AnyPgColumn => eventCommentTable.id,
    ),
    createdAt: timestamp("created_at")
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp("updated_at")
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (t) => [
    index("event_comments_event_id_idx").on(t.eventId),
    index("event_comments_parent_id_idx").on(t.parentId),
  ],
).enableRLS()

export const eventCommentRelations = relations(
  eventCommentTable,
  ({ one, many }) => ({
    event: one(eventTable, {
      fields: [eventCommentTable.eventId],
      references: [eventTable.id],
    }),
    author: one(userTable, {
      fields: [eventCommentTable.userId],
      references: [userTable.id],
    }),
    parent: one(eventCommentTable, {
      fields: [eventCommentTable.parentId],
      references: [eventCommentTable.id],
      relationName: "parent",
    }),
    replies: many(eventCommentTable, { relationName: "parent" }),
  }),
)

export type EventComment = typeof eventCommentTable.$inferSelect
export type NewEventComment = typeof eventCommentTable.$inferInsert
