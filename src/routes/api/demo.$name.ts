import { createFileRoute } from "@tanstack/react-router"
import { json } from "@tanstack/react-start"
import { setCookie, setResponseHeader } from "@tanstack/react-start/server"

export const Route = createFileRoute("/api/demo/$name")({
  server: {
    middleware: [],
    handlers: {
      GET: ({ request, params }) => {
        setResponseHeader("X-My-Custom-Header", "Hello World!")
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
    },
  },
  // component: () => <div>Hello!</div>,
})
