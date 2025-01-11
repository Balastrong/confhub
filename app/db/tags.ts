import { createServerFn } from "@tanstack/start";
import { getSupabaseServerClient } from "~/lib/supabase";
import { sleep } from "~/lib/utils";

export const getTags = createServerFn().handler(async () => {
  const supabase = getSupabaseServerClient();

  await sleep(Math.random() * 600 + 200);

  return (await supabase.from("tags").select("*").throwOnError()).data ?? [];
});
