import {
  queryOptions,
  useSuspenseQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { createServerOnlyFn, createServerFn } from "@tanstack/react-start"
import { renderServerComponent } from "@tanstack/react-start/rsc"
import { Suspense } from "react"
import z from "zod"

const fetchPersonFromDatabase = createServerOnlyFn((id: string) => {
  const people = [
    {
      name: "Mario",
      surname: "Rossi",
    },
    {
      name: "Luigi",
      surname: "Verdi",
    },
    {
      name: "Peach",
      surname: "Pink",
    },
  ]

  return people[parseInt(id) - 1] || { name: "unknown", surname: "" }
})

// Server component — runs only on the server
async function ServerPerson({
  person,
}: {
  person: { name: string; surname: string }
}) {
  const now = new Date().toISOString()

  return (
    <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm space-y-2 max-w-md">
      <h2 className="text-xl font-semibold">Server person</h2>
      <p className="text-sm text-muted-foreground">
        Rendered on the server at: <strong>{now}</strong>
      </p>
      <p className="text-sm text-muted-foreground">
        Person:{" "}
        <strong>
          {person.name} {person.surname}
        </strong>
      </p>
    </div>
  )
}

const getServerPerson = createServerFn()
  .inputValidator(z.object({ id: z.string() }))
  .handler(({ data: { id } }) => {
    const person = fetchPersonFromDatabase(id)

    return renderServerComponent(<ServerPerson person={person} />)
  })

const personQuery = (id: string) =>
  queryOptions({
    queryKey: ["server-person", id],
    queryFn: () => getServerPerson({ data: { id } }),
    structuralSharing: false, // Required for RSC
  })

export const Route = createFileRoute("/demo/rsc-query/$id")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(personQuery(params.id)),
  component: RscQueryPage,
})

function RscQueryPage() {
  return (
    <div className="p-8 max-w-lg space-y-6">
      <h1 className="text-3xl font-bold">RSC + TanStack Query</h1>
      <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
        <PersonContent />
      </Suspense>
    </div>
  )
}

function PersonContent() {
  const queryClient = useQueryClient()
  const { id } = Route.useParams()
  const { data } = useSuspenseQuery(personQuery(id))

  return (
    <div className="space-y-4">
      {data}
      <button
        className="cursor-pointer px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
        onClick={() =>
          queryClient.invalidateQueries({
            queryKey: personQuery(id).queryKey,
          })
        }
      >
        Reload server component
      </button>
    </div>
  )
}
