import { z } from "zod"

export const CreateEventRequestSchema = z.object({
  url: z.string().url().min(1),
})

export type CreateEventRequest = z.infer<typeof CreateEventRequestSchema>
