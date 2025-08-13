import "dotenv/config"
import { defineConfig } from "drizzle-kit"

// TODO: Centralize env reading
const connectionString =
  process.env.NODE_ENV !== "production"
    ? process.env.DATABASE_URL!
    : "postgres://postgres:postgres@db.localtest.me:5432/main"

export default defineConfig({
  schema: "./src/lib/db/schema",
  out: "./src/lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
})
