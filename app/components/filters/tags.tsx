import { useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "~/components/ui/button";
import { tagQueries } from "~/queries";

type Props = {
  selectedTags: string[];
  onToggleTag: (filter: string) => void;
};

export const Tags = ({ selectedTags, onToggleTag }: Props) => {
  const { data: tags } = useSuspenseQuery(tagQueries.list());

  return (
    <>
      {tags.map((tag) => (
        <Button
          key={tag.id}
          size={"xs"}
          onClick={() => onToggleTag(tag.name)}
          variant={selectedTags.includes(tag.name) ? "default" : "outline"}
        >
          {tag.name}
        </Button>
      ))}
    </>
  );
};
