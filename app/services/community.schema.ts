import { z } from "zod"

export const CreateCommunitySchema = z.object({
  name: z.string().min(3).max(50),
  location: z.string().min(3).max(50).optional(),
  logoUrl: z.string().url().optional(),
})

export type CreateCommunityInput = z.infer<typeof CreateCommunitySchema>
