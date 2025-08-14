import { relations } from "drizzle-orm"
import {
  pgEnum,
  pgTable,
  integer,
  text,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core"
import { eventTable } from "./event"
import { userTable } from "./user"

export const rsvpStatus = pgEnum("rsvp_status", [
  "going",
  "interested",
  "not_going",
])

export const eventRsvpTable = pgTable(
  "event_rsvps",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    eventId: integer("event_id")
      .notNull()
      .references(() => eventTable.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    status: rsvpStatus("status").notNull(),
    createdAt: timestamp("created_at")
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp("updated_at")
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (t) => [
    uniqueIndex("event_rsvps_event_user_uniq").on(t.eventId, t.userId),
    index("event_rsvps_event_status_idx").on(t.eventId, t.status),
    index("event_rsvps_user_status_idx").on(t.userId, t.status),
  ],
)

export const eventRsvpRelations = relations(eventRsvpTable, ({ one }) => ({
  event: one(eventTable, {
    fields: [eventRsvpTable.eventId],
    references: [eventTable.id],
  }),
  user: one(userTable, {
    fields: [eventRsvpTable.userId],
    references: [userTable.id],
  }),
}))

export type EventRsvp = typeof eventRsvpTable.$inferSelect
export type NewEventRsvp = typeof eventRsvpTable.$inferInsert
