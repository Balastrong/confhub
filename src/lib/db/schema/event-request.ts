import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core"
import { userTable } from "./user"

export const eventRequestTable = pgTable("event_requests", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  url: text().notNull(),
  dateCreated: timestamp("date_created")
    .$defaultFn(() => new Date())
    .notNull(),
  userId: text("user_id").references(() => userTable.id),
}).enableRLS()
