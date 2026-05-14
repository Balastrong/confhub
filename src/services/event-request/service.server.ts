import { db } from "~/lib/db"
import { eventRequestTable } from "~/lib/db/schema"

export type EventRequestServiceDeps = {
  db: typeof db
}

export function createEventRequestService(deps: EventRequestServiceDeps) {
  return {
    async createEventRequest(url: string, userId?: string) {
      const [newEventRequest] = await deps.db
        .insert(eventRequestTable)
        .values({
          url,
          userId: userId || null,
        })
        .returning()

      return newEventRequest
    },
  }
}

export const eventRequestService = createEventRequestService({ db })
