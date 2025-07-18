import { neon, neonConfig } from "@neondatabase/serverless"
import "dotenv/config"
import { drizzle } from "drizzle-orm/neon-http"

let connectionString = process.env.DATABASE_URL!

if (process.env.NODE_ENV !== "production") {
  connectionString = "postgres://postgres:postgres@db.localtest.me:5432/main"
  neonConfig.fetchEndpoint = (host) => {
    const [protocol, port] =
      host === "db.localtest.me" ? ["http", 4444] : ["https", 443]
    return `${protocol}://${host}:${port}/sql`
  }
  const connectionStringUrl = new URL(connectionString)
  neonConfig.useSecureWebSocket =
    connectionStringUrl.hostname !== "db.localtest.me"
  neonConfig.wsProxy = (host) =>
    host === "db.localtest.me" ? `${host}:4444/v2` : `${host}/v2`
}

export const sql = neon(connectionString)

export const db = drizzle(sql)
