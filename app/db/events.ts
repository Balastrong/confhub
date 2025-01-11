import { createServerFn } from "@tanstack/start";
import { z } from "zod";
import { getSupabaseServerClient } from "~/lib/supabase";
import { sleep } from "~/lib/utils";
import { FiltersSchema } from "~/routes";

export const getEvents = createServerFn()
  .validator(FiltersSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();

    await sleep(Math.random() * 600 + 200);

    let query = supabase.from("events").select("*, tags!inner(id, name)");

    if (Object.values(data).some((value) => value)) {
      if (data.country) {
        query = query.eq("country", data.country);
      }

      if (data.modes) {
        query = query.in("mode", data.modes);
      }

      if (data.tags) {
        query = query.in("tags.name", data.tags);
      }
    }

    return (await query.throwOnError()).data ?? [];
  });

export type FullEvent = Awaited<ReturnType<typeof getEvents>>[0];
