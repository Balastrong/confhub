import { z } from "zod"

const EventModeSchema = z.union([
  z.literal("In person"),
  z.literal("Hybrid"),
  z.literal("Remote"),
])

export const EventModes = EventModeSchema.options.map((mode) => mode.value)

export const EventFiltersSchema = z
  .object({
    query: z.string().transform((value) => (value ? value : undefined)),
    tags: z
      .array(z.string())
      .transform((value) => (value?.length ? value : undefined)),
    modes: z
      .array(EventModeSchema)
      .transform((value) => (value?.length ? value : undefined)),
    country: z.string(),
    hasCfpOpen: z.boolean().transform((value) => value || undefined),
  })
  .partial()

export type EventFilters = z.infer<typeof EventFiltersSchema>
