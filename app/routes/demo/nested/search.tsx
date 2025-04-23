import { createFileRoute } from "@tanstack/react-router"

type ProductSearchSortOptions = "newest" | "oldest" | "price"

type ProductSearch = {
  page: number
  filter: string
  sort: ProductSearchSortOptions
}

export const Route = createFileRoute("/demo/nested/search")({
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
  const { page, filter, sort } = Route.useSearch()

  return <div>Hello "/demo/nested/search"!</div>
}
