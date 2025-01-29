import { createServerFn } from "@tanstack/start"
import { getSupabaseServerClient } from "~/lib/supabase"
import { FiltersSchema } from "~/routes"

export const getEvents = createServerFn()
  .validator(FiltersSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()

    let query = supabase.from("events").select("id, tags!inner(name)")

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
    }

    const eventIds = (await query.throwOnError()).data?.map((e) => e.id) ?? []

    const eventsWithTags = supabase
      .from("events")
      .select("*, tags(*)")
      .in("id", eventIds)
      .order("name")

    return (await eventsWithTags.throwOnError()).data ?? []
  })

export type FullEvent = Awaited<ReturnType<typeof getEvents>>[number]
