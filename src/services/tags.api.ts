import { createServerFn } from "@tanstack/react-start"
import { db } from "~/lib/db"
import { eventTable } from "~/lib/db/schema"
import { isNotNull } from "drizzle-orm"

export const getTags = createServerFn().handler(async () => {
  try {
    // Get all events that have tags
    const events = await db
      .select({
        tags: eventTable.tags,
      })
      .from(eventTable)
      .where(isNotNull(eventTable.tags))

    // Extract all tags, flatten the arrays, convert to lowercase, and make distinct
    const allTags = events
      .flatMap((event) => event.tags || [])
      .map((tag) => tag.toLowerCase().trim())
      .filter((tag) => tag !== "")

    // Get unique tags and sort them
    const uniqueTags = [...new Set(allTags)].sort()

    return uniqueTags
  } catch (error) {
    console.error("Error fetching tags:", error)
    // Return fallback tags if database query fails
    return ["backend", "devops", "frontend"]
  }
})
