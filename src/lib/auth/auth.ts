import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "../db"
import { reactStartCookies } from "better-auth/react-start"
import * as schema from "../db/schema"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.userTable,
      account: schema.accountTable,
      session: schema.sessionTable,
      verification: schema.verificationTable,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [reactStartCookies()],
})
