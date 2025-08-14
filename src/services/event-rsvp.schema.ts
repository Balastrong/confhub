import { z } from "zod"

export const RsvpStatusEnum = z.enum(["going", "interested", "not_going"])

export const UpsertRsvpSchema = z.object({
  eventId: z.number(),
  status: RsvpStatusEnum,
})

export const GetRsvpSchema = z.object({
  eventId: z.number(),
})

export type RsvpStatus = z.infer<typeof RsvpStatusEnum>
export type UpsertRsvp = z.infer<typeof UpsertRsvpSchema>
export type GetRsvp = z.infer<typeof GetRsvpSchema>
