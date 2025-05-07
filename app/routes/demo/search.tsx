import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useRef } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"

type ProductSearchSortOptions = "newest" | "oldest" | "price"

type ProductSearch = {
  page: number
  filter: string
  sort: ProductSearchSortOptions
}

export const Route = createFileRoute("/demo/search")({
  component: RouteComponent,
  validateSearch: (search): ProductSearch => {
    return {
      page: Number(search?.page ?? 1),
      filter: (search.filter as string) || "",
      sort: (search.sort as ProductSearchSortOptions) || "newest",
    }
  },
})

function RouteComponent() {
  return (
    <div className="flex flex-col gap-4 m-2 p-2 w-64 border-2 border-green-700">
      <h1 className="text-2xl font-bold">Route component</h1>
      <PageComponent />
      <FilterComponent />
      <AnotherComponent />
    </div>
  )
}

const PageComponent = () => {
  const navigate = useNavigate()
  const page = Route.useSearch({ select: (search) => search.page })

  const setPage = (newPage: number) => {
    navigate({
      from: Route.fullPath,
      search: (prev) => ({ ...prev, page: newPage }),
    })
  }

  const renderCount = useRef(0)
  renderCount.current += 1

  return (
    <div className="p-2 border-2 border-red-700">
      <Button onClick={() => setPage(page + 1)}>Next Page</Button>
      <p>We are on page {page}</p>
      <p>Rerenders: {renderCount.current}</p>
    </div>
  )
}

const FilterComponent = () => {
  const navigate = useNavigate()
  const filter = Route.useSearch({ select: (search) => search.filter })

  const setFilter = (newFilter: string) => {
    navigate({
      from: Route.fullPath,
      search: (prev) => ({ ...prev, filter: newFilter }),
    })
  }

  const renderCount = useRef(0)
  renderCount.current += 1

  return (
    <div className="p-2 border-2 border-red-700">
      <Input value={filter} onChange={(e) => setFilter(e.target.value)} />
      <p>Filter: {filter}</p>
      <p>Rerenders: {renderCount.current}</p>
    </div>
  )
}

const AnotherComponent = () => {
  const renderCount = useRef(0)
  renderCount.current += 1

  return (
    <div className="p-2 border-2 border-red-700">
      <p>Here's another component</p>
      <p>Rerenders: {renderCount.current}</p>
    </div>
  )
}
