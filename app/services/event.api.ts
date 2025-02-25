import { createServerFn } from "@tanstack/start"
import { getSupabaseServerClient } from "~/lib/supabase"
import { TablesInsert } from "~/lib/types.gen"
import { CreateEventSchema, EventFiltersSchema } from "./event.schema"
import { z } from "zod"

export const getEvents = createServerFn()
  .validator(EventFiltersSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()

    let query = supabase.from("events").select("id, tags!inner(name)")

    if (data.communityDraft === undefined) {
      query = query.not("communityDraft", "is", true)
    } else {
      query = query.is("communityDraft", data.communityDraft)
    }

    if (Object.values(data).some((value) => value)) {
      if (data.query) {
        query = query.ilike("name", `%${data.query}%`)
      }

      if (data.modes) {
        query = query.in("mode", data.modes)
      }

      if (data.tags) {
        query = query.in("tags.name", data.tags)
      }

      if (data.country) {
        query = query.eq("country", data.country)
      }

      if (data.hasCfpOpen) {
        query = query.gte("cfpClosingDate", new Date().toDateString())
      }

      if (data.communityId) {
        query = query.eq("communityId", data.communityId)
      }

      if (data.startDate) {
        query = query.or(
          `date.gte.${data.startDate},dateEnd.gte.${data.startDate}`,
        )
      }

      if (data.endDate) {
        query = query.or(`date.lte.${data.endDate},dateEnd.lte.${data.endDate}`)
      }
    }

    const eventIds = (await query.throwOnError()).data?.map((e) => e.id) ?? []

    const eventsWithTags = supabase
      .from("events")
      .select("*, tags(*)")
      .in("id", eventIds)
      .order("name")

    return (await eventsWithTags.throwOnError()).data ?? []
  })

export const getEvent = createServerFn()
  .validator(
    z.object({
      id: z.number(),
    }),
  )
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()

    const { data: event, error } = await supabase
      .from("events")
      .select("*, tags(*)")
      .eq("id", data.id)
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return event
  })

export const upsertEvent = createServerFn()
  .validator(CreateEventSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()

    const { tags, ...event } = data

    const { error, data: eventData } = await supabase
      .from("events")
      .upsert(event)
      .select("id")
      .single()

    if (error) {
      throw new Error(error.message)
    }

    // Delete existing tags for the event
    const { error: deleteTagError } = await supabase
      .from("event_tag")
      .delete()
      .eq("event", eventData.id)

    if (deleteTagError) {
      throw new Error(deleteTagError.message)
    }

    const { error: tagError } = await supabase
      .from("event_tag")
      .insert(
        tags.map(
          (tag) =>
            ({ event: eventData.id, tag: tag }) as TablesInsert<"event_tag">,
        ),
      )

    if (tagError) {
      throw new Error(tagError.message)
    }
  })
