import { createFileRoute, useNavigate } from "@tanstack/react-router"
import React from "react"
import z from "zod"
import { FilteredList } from "~/components/filters-list"

const ItemsFilterSchema = z.object({
  query: z.string().min(3).max(50).optional(),
  category: z.enum(["all", "books", "electronics", "clothing"]).optional(),
  page: z.coerce.number().min(1).optional(),
})

export type ItemsFilter = z.infer<typeof ItemsFilterSchema>

export const Route = createFileRoute("/demo/search")({
  component: RouteComponent,
  validateSearch: ItemsFilterSchema,
})

function RouteComponent() {
  const [filters, setFilters] = React.useState<ItemsFilter>({})

  return (
    <div>
      <h1>Items</h1>
      <FilteredList filters={filters} onSetFilters={setFilters} />
    </div>
  )
}
