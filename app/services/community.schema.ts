import { z } from "zod"

export const CreateCommunitySchema = z.object({
  name: z.string().min(3).max(50),
  location: z.string().min(3).max(50).optional(),
  logoUrl: z.string().url().optional(),
})
export type CreateCommunityInput = z.infer<typeof CreateCommunitySchema>

export const JoinCommunitySchema = z.object({
  communityId: z.number(),
})
export type JoinCommunityInput = z.infer<typeof JoinCommunitySchema>

export const UpdateCommunitySchema = CreateCommunitySchema.extend({
  id: z.number(),
})
export type UpdateCommunityInput = z.infer<typeof UpdateCommunitySchema>

export const CommunityFiltersSchema = z.object({
  ownCommunitiesOnly: z.boolean().optional(),
})
export type CommunityFilters = z.infer<typeof CommunityFiltersSchema>
