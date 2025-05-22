import {
  boolean,
  date,
  integer,
  pgEnum,
  pgTable,
  text,
} from "drizzle-orm/pg-core"
import { communityTable } from "./community"

export const eventModeEnum = pgEnum("eventMode", [
  "in-person",
  "online",
  "hybrid",
])

export const eventTable = pgTable("events", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  description: text(),
  date: date().notNull(),
  dateEnd: date("date_end"),
  eventUrl: text("event_url"),
  cfpUrl: text("cfp_url"),
  cfpClosingDate: date("cfp_closing_date"),
  mode: eventModeEnum(),
  city: text(),
  country: text(),
  tags: text().array(),
  draft: boolean("draft").default(false),
  communityId: integer("community_id").references(() => communityTable.id),
})
