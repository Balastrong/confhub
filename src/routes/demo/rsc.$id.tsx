import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { renderServerComponent } from "@tanstack/react-start/rsc"
import z from "zod"
import { getFriend } from "~/services/friend"

// This async component runs only on the server
async function ServerFriend({ id }: { id: string }) {
  const person = await getFriend(id)
  const now = new Date().toISOString()

  return (
    <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm space-y-2 max-w-md">
      <h2 className="text-xl font-semibold">Hello from the server! 👋</h2>
      <p className="text-sm text-muted-foreground">
        Rendered at: <strong>{now}</strong>
      </p>
      <p className="text-sm text-muted-foreground">
        Person:{" "}
        <strong>
          {person.name} {person.surname}
        </strong>{" "}
        (id: {person.id})
      </p>
    </div>
  )
}

const getRscContent = createServerFn()
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data: { id } }) => {
    return renderServerComponent(<ServerFriend id={id} />)
  })

export const Route = createFileRoute("/demo/rsc/$id")({
  loader: ({ params }) => getRscContent({ data: { id: params.id } }),
  component: RscPage,
})

function RscPage() {
  const content = Route.useLoaderData()
  return (
    <div className="p-8 max-w-lg">
      <h1 className="text-3xl font-bold mb-6">React Server Components</h1>
      <div className="border border-red-400 p-2">{content}</div>
    </div>
  )
}
