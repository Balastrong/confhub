import {
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core"

/**
 * Fixed-window rate limit counters per user/route/window_start.
 * One row per (userId, route, windowName, windowStart)
 */
export const rateLimitTable = pgTable(
  "rate_limits",
  {
    userId: text("user_id").notNull(),
    route: text("route").notNull(),
    windowName: text("window_name").notNull(), // e.g. "min", "day"
    windowStart: timestamp("window_start").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    count: integer("count").notNull().default(1),
  },
  (t) => [
    primaryKey({
      name: "rate_limits_pk",
      columns: [t.userId, t.route, t.windowName, t.windowStart],
    }),
    index("rate_limits_expires_at_idx").on(t.expiresAt),
  ],
).enableRLS()

export type RateLimitRow = typeof rateLimitTable.$inferSelect
export type RateLimitInsert = typeof rateLimitTable.$inferInsert
