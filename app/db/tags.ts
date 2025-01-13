import { createServerFn } from "@tanstack/start";
import { getSupabaseServerClient } from "~/lib/supabase";

export const getTags = createServerFn().handler(async () => {
  const supabase = getSupabaseServerClient();

  return (await supabase.from("tags").select("*").throwOnError()).data ?? [];
});
