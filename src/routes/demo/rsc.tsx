import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { renderServerComponent } from "@tanstack/react-start/rsc"

// This async component runs only on the server
async function ServerCard() {
  const now = new Date().toISOString()
  return (
    <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm space-y-2 max-w-sm">
      <h2 className="text-xl font-semibold">Hello from the server! 👋</h2>
      <p className="text-sm text-muted-foreground">
        Rendered at: <strong>{now}</strong>
      </p>
      <p className="text-sm text-muted-foreground">
        Node.js: <strong>{process.version}</strong>
      </p>
    </div>
  )
}

const getRscContent = createServerFn().handler(async () => {
  return renderServerComponent(<ServerCard />)
})

export const Route = createFileRoute("/demo/rsc")({
  loader: () => getRscContent(),
  component: RscPage,
})

function RscPage() {
  const content = Route.useLoaderData()
  return (
    <div className="p-8 max-w-lg">
      <h1 className="text-3xl font-bold mb-6">React Server Components</h1>
      {content}
    </div>
  )
}
