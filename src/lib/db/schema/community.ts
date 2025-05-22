import { text, integer, pgTable, primaryKey } from "drizzle-orm/pg-core"
import { userTable } from "./user"
import { relations } from "drizzle-orm"

export const communityTable = pgTable("communities", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  description: text(),
  logoUrl: text("logo_url"),
  homeUrl: text("home_url"),
})

export type Community = typeof communityTable.$inferSelect
export type CommunityWithMember = Community & { isMember: boolean }

export const communityRelations = relations(communityTable, ({ many }) => ({
  usersInCommunityTable: many(usersInCommunityTable),
}))

export const usersInCommunityTable = pgTable(
  "users_in_community", // TODO: rename to user_community?
  {
    userId: text("user_id")
      .notNull()
      .references(() => userTable.id),
    communityId: integer("community_id")
      .notNull()
      .references(() => communityTable.id),
  },
  (t) => [primaryKey({ columns: [t.userId, t.communityId] })],
)

export const usersInCommunityRelations = relations(
  usersInCommunityTable,
  ({ one }) => ({
    group: one(communityTable, {
      fields: [usersInCommunityTable.communityId],
      references: [communityTable.id],
    }),
    user: one(userTable, {
      fields: [usersInCommunityTable.userId],
      references: [userTable.id],
    }),
  }),
)
