import { createServerFn } from "@tanstack/start"
import { getSupabaseServerClient } from "~/lib/supabase"
import { CreateCommunitySchema } from "./community.schema"

export const createCommunity = createServerFn()
  .validator(CreateCommunitySchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()

    const { data: community, error } = await supabase
      .from("communities")
      .insert(data)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return community
  })

export const getCommunities = createServerFn().handler(async () => {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from("communities")
    .select()
    .order("name")

  if (error) {
    throw new Error(error.message)
  }

  return data
})
