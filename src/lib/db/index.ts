import postgres from "postgres"
import "dotenv/config"
import { drizzle } from "drizzle-orm/postgres-js"

export const sql = postgres(process.env.DATABASE_URL!)

export const db = drizzle(sql)
