import { parseCookies, setCookie } from "vinxi/http";
import { createServerClient } from "@supabase/ssr";
import { Database } from "~/db/types.gen";

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
