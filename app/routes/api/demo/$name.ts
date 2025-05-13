import { json } from "@tanstack/react-start"
import { createAPIFileRoute } from "@tanstack/react-start/api"
import { setHeader, setCookie } from "@tanstack/react-start/server"

/*

Devinxi version:

export const ServerRoute = createServerFileRoute().methods({
  GET: async ({ params, request }) => {
...

*/

export const APIRoute = createAPIFileRoute("/api/demo/$name")({
  GET: ({ request, params }) => {
    setHeader("X-My-Custom-Header", "Hello World!")
    setCookie("my-cookie", "cookie-value")

    return json({
      message: `Hello ${params.name}!`,
      method: request.method,
    })
  },
  POST: ({ params: { name } }) => {
    return new Response(`Hello ${name}!`, {
      headers: {
        "Content-Type": "text/plain",
      },
    })
  },
})
