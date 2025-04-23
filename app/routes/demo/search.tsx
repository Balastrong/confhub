import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useState, useEffect, useRef } from "react"
import { Button } from "~/components/ui/button"

type ProductSearchSortOptions = "newest" | "oldest" | "price"

type ProductSearch = {
  page: number
  filter: string
  sort: ProductSearchSortOptions
}

export const Route = createFileRoute("/demo/search")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): ProductSearch => {
    return {
      page: Number(search?.page ?? 1),
      filter: (search.filter as string) || "",
      sort: (search.sort as ProductSearchSortOptions) || "newest",
    }
  },
})

function RouteComponent() {
  return (
    <div className="flex flex-col gap-4">
      <PageComponent />
      <AnotherComponent />
    </div>
  )
}

const PageComponent = () => {
  const navigate = useNavigate()
  const page = Route.useSearch({
    select: (search) => search.page,
  })

  const setSearch = (newPage: number) => {
    navigate({
      from: Route.fullPath,
      search: (prev) => ({ ...prev, page: newPage }),
    })
  }

  const renderCount = useRef(0)
  renderCount.current += 1

  return (
    <div>
      <Button onClick={() => setSearch(page + 1)}>Next Page</Button>
      <p>We are on page {page}</p>
      <p>Rerenders: {renderCount.current}</p>
    </div>
  )
}

const AnotherComponent = () => {
  const renderCount = useRef(0)
  renderCount.current += 1

  return (
    <div>
      <p>Here's another component</p>
      <p>Rerenders: {renderCount.current}</p>
    </div>
  )
}
