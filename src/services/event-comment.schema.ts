import { z } from "zod"

export const CreateEventCommentSchema = z.object({
  eventId: z.number(),
  content: z.string().trim().min(1).max(500),
  rating: z.number().int().min(1).max(5).optional(),
  parentId: z.string().uuid().optional(),
})

export type CreateEventComment = z.infer<typeof CreateEventCommentSchema>
