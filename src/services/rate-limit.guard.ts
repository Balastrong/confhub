import { createServerOnlyFn, json } from "@tanstack/react-start"
import { sql } from "drizzle-orm"
import { db } from "~/lib/db"
import { rateLimitTable } from "~/lib/db/schema"

type WindowCfg = {
  name: string // "min" | "day" | etc
  limit: number
  windowSec: number
}

function truncToWindowStart(now: Date, windowSec: number): Date {
  const ms = Math.floor(now.getTime() / 1000)
  const start = Math.floor(ms / windowSec) * windowSec
  return new Date(start * 1000)
}
export const rateLimitGuard = createServerOnlyFn(
  async (config: { prefix: string; windows: WindowCfg[]; userId: string }) => {
    const userId = config.userId
    const routeKey = config.prefix + ":" + userId
    const now = new Date()

    // Track the tightest remaining/reset among all windows for headers
    let allowed = true
    let minRemaining = Infinity
    let retryAt: Date | null = null
    let tightestIdx: number | null = null

    await db.transaction(async (tx) => {
      for (let i = 0; i < config.windows.length; i++) {
        const w = config.windows[i]
        const windowStart = truncToWindowStart(now, w.windowSec)
        const expiresAt = new Date(windowStart.getTime() + w.windowSec * 1000)

        // Perform atomic upsert with conditional increment if under limit
        const res = await tx
          .insert(rateLimitTable)
          .values({
            userId,
            route: routeKey,
            windowName: w.name,
            windowStart,
            expiresAt,
            count: 1,
          })
          .onConflictDoUpdate({
            target: [
              rateLimitTable.userId,
              rateLimitTable.route,
              rateLimitTable.windowName,
              rateLimitTable.windowStart,
            ],
            set: {
              count: sql`${rateLimitTable.count} + 1`,
              // keep expiresAt as-is
            },
            where: sql`${rateLimitTable.count} < ${w.limit}`,
          })
          .returning({
            count: rateLimitTable.count,
            expiresAt: rateLimitTable.expiresAt,
          })

        const row = res[0]
        if (!row) {
          // Update did not happen due to WHERE count < limit failing.
          allowed = false
          const reset = expiresAt
          // remaining is 0
          if (!retryAt || reset < retryAt) {
            retryAt = reset
            tightestIdx = i
          }
        } else {
          const remaining = Math.max(0, w.limit - row.count)
          if (remaining < minRemaining) {
            minRemaining = remaining
            tightestIdx = i
            retryAt = row.expiresAt
          }
        }
      }
    })

    if (!allowed) {
      const nowSec = Math.floor(now.getTime() / 1000)
      const resetMs = (retryAt ?? now).getTime()
      const resetSec = Math.floor(resetMs / 1000)
      const retryAfter = Math.max(0, resetSec - nowSec)

      // Return 429 with standard headers for the tightest window
      const headers: Record<string, string> = {}
      if (tightestIdx !== null) {
        const t = config.windows[tightestIdx]
        headers["X-RateLimit-Limit"] = String(t.limit)
        headers["X-RateLimit-Remaining"] = "0"
        headers["X-RateLimit-Reset"] = String(resetSec)
        headers["Retry-After"] = String(retryAfter)
      }

      throw json(
        { message: "Rate limit exceeded. Try again later." },
        { status: 429, headers },
      )
    }
  },
)
