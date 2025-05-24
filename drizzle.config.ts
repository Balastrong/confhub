import "dotenv/config"
import { defineConfig } from "drizzle-kit"

// TODO: Centralize env reading
const connectionString =
  process.env.NODE_ENV === "development"
    ? "postgres://postgres:postgres@db.localtest.me:5432/main"
    : process.env.DATABASE_URL!

export default defineConfig({
  schema: "./src/lib/db/schema",
  out: "./src/lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
})
