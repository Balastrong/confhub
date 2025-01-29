import { useSuspenseQuery } from "@tanstack/react-query"
import { Button } from "~/components/ui/button"
import { tagQueries } from "~/services/queries"
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
          key={tag.id}
          className="cursor-pointer"
          onClick={() => onToggleTag(tag.name)}
          variant={selectedTags.includes(tag.name) ? "default" : "outline"}
        >
          {tag.name}
        </Badge>
      ))}
    </>
  )
}
