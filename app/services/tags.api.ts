import { createServerFn } from "@tanstack/react-start"
import { getSupabaseServerClient } from "~/lib/supabase"

export const getTags = createServerFn().handler(async () => {
  const supabase = getSupabaseServerClient()

  const response = await supabase
    .from("tags")
    .select("*")
    .order("category")
    .order("name")
    .throwOnError()

  return response.data ?? []
})
