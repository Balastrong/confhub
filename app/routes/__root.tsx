import { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Outlet,
  ScrollRestoration,
} from "@tanstack/react-router";
import { createServerFn, Meta, Scripts } from "@tanstack/start";
import * as React from "react";
import { Header } from "~/components/header";
// @ts-expect-error
import css from "~/globals.css?url";
import { getSupabaseServerClient, User } from "~/lib/supabase";

export const getSupabaseSession = createServerFn().handler<User | undefined>(
  async () => {
    const supabase = getSupabaseServerClient();

    const { data } = await supabase.auth.getUser();

    if (data.user?.email) {
      return { email: data.user.email };
    }
  }
);

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  user?: User;
}>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "ConfHub!",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: css,
      },
      {
        rel: "icon",
        type: "image/png",
        href: "favicon.png",
      },
    ],
  }),
  component: RootComponent,
  beforeLoad: async () => {
    return {
      user: await getSupabaseSession(),
    };
  },
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const { user } = Route.useRouteContext();

  return (
    <html>
      <head>
        <Meta />
      </head>
      <body>
        <Header user={user} />
        <hr />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
