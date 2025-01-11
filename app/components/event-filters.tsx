import { useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "~/components/ui/button";
import { tagQueries } from "~/queries";

type Props = {
  selectedFilters: string[];
  onToggleFilter: (filter: string) => void;
};

export const EventFilters = ({ selectedFilters, onToggleFilter }: Props) => {
  const { data: tags } = useSuspenseQuery(tagQueries.list());

  return tags.map((tag) => (
    <Button
      key={tag.id}
      size={"xs"}
      onClick={() => onToggleFilter(tag.name)}
      variant={selectedFilters.includes(tag.name) ? "default" : "outline"}
    >
      {tag.name}
    </Button>
  ));
};
