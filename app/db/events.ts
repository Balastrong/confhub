import { createServerFn } from "@tanstack/start";
import { z } from "zod";
import { getSupabaseServerClient } from "~/lib/supabase";
import { sleep } from "~/lib/utils";

export const getEvents = createServerFn()
  .validator(z.array(z.string()))
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();

    await sleep(Math.random() * 600 + 200);

    let query = supabase.from("events").select("*, tags!inner(id, name)");

    if (data.length) {
      query = query.in("tags.name", data);
    }

    return (await query.throwOnError()).data ?? [];
  });

export type FullEvent = Awaited<ReturnType<typeof getEvents>>[0];
