import { isNotNull } from "drizzle-orm"
import { db } from "~/lib/db"
import { eventTable } from "~/lib/db/schema"

export type TagsServiceDeps = {
  db: typeof db
}

export function createTagsService(deps: TagsServiceDeps) {
  return {
    async getTags() {
      try {
        const events = await deps.db
          .select({
            tags: eventTable.tags,
          })
          .from(eventTable)
          .where(isNotNull(eventTable.tags))

        const allTags = events
          .flatMap((event) => event.tags || [])
          .map((tag) => tag.toLowerCase().trim())
          .filter((tag) => tag !== "")

        return [...new Set(allTags)].sort()
      } catch (error) {
        console.error("Error fetching tags:", error)
        return ["backend", "devops", "frontend"]
      }
    },
  }
}

export const tagsService = createTagsService({ db })
