import { useSuspenseQuery } from "@tanstack/react-query"
import { Button } from "src/components/ui/button"
import { tagQueries } from "src/services/queries"
import { Badge } from "../ui/badge"

type Props = {
  selectedTags: string[]
  onToggleTag: (filter: string) => void
}

export const Tags = ({ selectedTags, onToggleTag }: Props) => {
  const { data: tags } = useSuspenseQuery(tagQueries.list())

  return (
    <>
      {tags.map((tag) => (
        <Badge
          key={tag}
          className="cursor-pointer capitalize"
          onClick={() => onToggleTag(tag)}
          variant={selectedTags.includes(tag) ? "default" : "outline"}
        >
          {tag}
        </Badge>
      ))}
    </>
  )
}
