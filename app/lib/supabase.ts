import { parseCookies, setCookie } from "vinxi/http";
import { createServerClient } from "@supabase/ssr";
import { Database } from "~/db/types.gen";
import { createServerFn } from "@tanstack/start";

// TODO: Doublecheck if this is in the client bundle
export function getSupabaseServerClient() {
  return createServerClient<Database>(
    (import.meta as any).env.VITE_SUPABASE_URL!,
    (import.meta as any).env.VITE_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return Object.entries(parseCookies()).map(([name, value]) => ({
            name,
            value,
          }));
        },
        setAll(cookies) {
          cookies.forEach((cookie) => {
            setCookie(cookie.name, cookie.value);
          });
        },
      },
    }
  );
}

export const getSupabaseSession = createServerFn().handler(async () => {
  const supabase = getSupabaseServerClient();

  const { data } = await supabase.auth.getUser();

  if (data) {
    return { email: data.user?.email };
  }
});
