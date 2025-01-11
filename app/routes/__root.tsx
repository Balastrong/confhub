import { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Outlet,
  ScrollRestoration,
} from "@tanstack/react-router";
import { Meta, Scripts } from "@tanstack/start";
import * as React from "react";
import { Header } from "~/components/header";
// @ts-expect-error
import css from "~/globals.css?url";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
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
        title: "Kickstart!",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: css,
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <Meta />
      </head>
      <body>
        <Header />
        <hr />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
