import { z } from "zod"

export const CreateCommunitySchema = z.object({
  name: z.string().min(3).max(50),
  location: z.string().min(3).max(50).optional(),
  logoUrl: z.string().url().optional(),
})

export const JoinCommunitySchema = z.object({
  communityId: z.number(),
})

export const UpdateCommunitySchema = CreateCommunitySchema.extend({
  id: z.number(),
})

export type CreateCommunityInput = z.infer<typeof CreateCommunitySchema>
export type JoinCommunityInput = z.infer<typeof JoinCommunitySchema>
export type UpdateCommunityInput = z.infer<typeof UpdateCommunitySchema>
