import { createServerOnlyFn, json } from "@tanstack/react-start"
import { sql } from "drizzle-orm"
import { db } from "~/lib/db"
import { rateLimitTable } from "~/lib/db/schema"

type WindowCfg = {
  name: string
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
    const routeKey = config.prefix + ":" + config.userId
    const now = new Date()

    let allowed = true
    let minRemaining = Infinity
    let retryAt: Date | null = null
    let tightestIdx: number | null = null

    await db.transaction(async (tx) => {
      for (let i = 0; i < config.windows.length; i++) {
        const window = config.windows[i]
        const windowStart = truncToWindowStart(now, window.windowSec)
        const expiresAt = new Date(
          windowStart.getTime() + window.windowSec * 1000,
        )

        const res = await tx
          .insert(rateLimitTable)
          .values({
            userId: config.userId,
            route: routeKey,
            windowName: window.name,
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
            },
            where: sql`${rateLimitTable.count} < ${window.limit}`,
          })
          .returning({
            count: rateLimitTable.count,
            expiresAt: rateLimitTable.expiresAt,
          })

        const row = res[0]

        if (!row) {
          allowed = false

          if (!retryAt || expiresAt < retryAt) {
            retryAt = expiresAt
            tightestIdx = i
          }
        } else {
          const remaining = Math.max(0, window.limit - row.count)

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
      const headers: Record<string, string> = {}

      if (tightestIdx !== null) {
        const tightestWindow = config.windows[tightestIdx]
        headers["X-RateLimit-Limit"] = String(tightestWindow.limit)
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
