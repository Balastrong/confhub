import "dotenv/config"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

export const db = drizzle({
  connection: process.env.DATABASE_URL!,
  schema,
})
