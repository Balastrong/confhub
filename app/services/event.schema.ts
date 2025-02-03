import { z } from "zod"
import { getEvents } from "./event.api"

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

export type FullEvent = Awaited<ReturnType<typeof getEvents>>[number]

export const CreateEventSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  eventUrl: z.string().url().nullish(),
  date: z.string().date(),
  dateEnd: z.string().date().nullish(),
  cfpUrl: z.string().url().nullish(),
  eventMode: EventModeSchema,
  country: z.string().min(1),
  city: z.string().nullish(),
  cfpClosingDate: z.string().date().nullish(),
  tags: z.array(z.number()).min(1),
})

export type CreateEvent = z.infer<typeof CreateEventSchema>
