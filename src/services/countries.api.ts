import { createServerFn } from "@tanstack/react-start"
import { db } from "~/lib/db"
import { eventTable } from "~/lib/db/schema"
import { isNotNull } from "drizzle-orm"

export const getCountries = createServerFn().handler(async () => {
  try {
    const rows = await db
      .select({ country: eventTable.country })
      .from(eventTable)
      .where(isNotNull(eventTable.country))

    const distinct = [
      ...new Set(
        rows
          .map((r) => r.country?.trim())
          .filter((c): c is string => !!c && c.length > 0),
      ),
    ].sort((a, b) => a.localeCompare(b))

    return distinct
  } catch (e) {
    console.error("Error fetching countries", e)
    return []
  }
})
