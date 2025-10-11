import { ItemsFilter } from "~/routes/demo/search"

export function FilteredList(_: {
  filters: ItemsFilter
  onSetFilters: (filters: ItemsFilter) => void
}) {
  return <div>Filtered List</div>
}
