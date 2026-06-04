import {
  queryOptions,
  useSuspenseQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { renderServerComponent } from "@tanstack/react-start/rsc"
import { Suspense } from "react"

// This async component runs only on the server
async function MyServerComponent() {
  const now = new Date().toISOString()

  return (
    <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm space-y-2 max-w-md">
      <h2 className="text-xl font-semibold">Server payload</h2>
      <p className="text-sm text-muted-foreground">
        Rendered on the server at: <strong>{now}</strong>
      </p>
      <p className="text-sm text-muted-foreground">
        TanStack Query is caching the rendered RSC result.
      </p>
    </div>
  )
}

const getMyServerComponent = createServerFn().handler(() => {
  return renderServerComponent(<MyServerComponent />)
})

const componentQuery = () =>
  queryOptions({
    queryKey: ["my-server-component"],
    queryFn: () => getMyServerComponent(),
    structuralSharing: false, // Required for RSC
  })

export const Route = createFileRoute("/demo/rsc-query")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(componentQuery()),
  component: RscQueryPage,
})

function RscQueryPage() {
  const queryClient = useQueryClient()
  // const content = Route.useLoaderData() // <= This was the previous example, from the route loader
  const { data: content } = useSuspenseQuery(componentQuery())

  const reload = () => {
    queryClient.invalidateQueries({
      queryKey: componentQuery().queryKey,
    })
  }

  return (
    <div className="p-8 max-w-lg space-y-6">
      <h1 className="text-3xl font-bold">RSC + TanStack Query</h1>
      <div className="border border-red-400 p-2">{content}</div>
      <button
        className="cursor-pointer px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
        onClick={reload}
      >
        Reload server component
      </button>
    </div>
  )
}
