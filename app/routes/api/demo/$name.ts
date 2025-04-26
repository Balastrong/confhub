import { json } from "@tanstack/react-start"
import { createAPIFileRoute } from "@tanstack/react-start/api"

export const APIRoute = createAPIFileRoute("/api/demo/$name")({
  GET: ({ request, params }) => {
    return json({
      message: `Hello ${params.name}! Requested from ${request.url}`,
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
