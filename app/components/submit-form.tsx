import { useForm } from "@tanstack/react-form"
import { useSuspenseQuery } from "@tanstack/react-query"
import { CreateEvent, CreateEventSchema } from "~/services/event.schema"
import { tagQueries, useCreateEventMutation } from "~/services/queries"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

export const SubmitForm = () => {
  const createEventMutation = useCreateEventMutation()
  const { data: tags } = useSuspenseQuery(tagQueries.list())

  const form = useForm({
    defaultValues: {
      name: "",
      tags: [],
    } as CreateEvent,
    validators: {
      onMount: CreateEventSchema,
      onChange: CreateEventSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await createEventMutation.mutateAsync({ data: value })
      } catch (error) {}

      form.reset()
    },
  })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    form.handleSubmit()
  }

  return (
    <form className="flex flex-col gap-2 w-full" onSubmit={onSubmit}>
      <form.Field
        name="name"
        children={(field) => {
          return (
            <div>
              <Label htmlFor={field.name}>
                Event Name
                <Input
                  name={field.name}
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Label>
            </div>
          )
        }}
      />
      <form.Field
        name="tags"
        children={(field) => {
          return (
            <div>
              <Label htmlFor={field.name}>Tags</Label>
              <div className="flex gap-1 flex-wrap items-center">
                {tags.map((tag) => {
                  const isSelected = field.state.value.includes(tag.id)
                  return (
                    <Badge
                      key={tag.id}
                      className="cursor-pointer"
                      role="checkbox"
                      onClick={() =>
                        isSelected
                          ? field.setValue(
                              field.state.value.filter((v) => v != tag.id),
                            )
                          : field.pushValue(tag.id)
                      }
                      variant={isSelected ? "default" : "outline"}
                    >
                      {tag.name}
                    </Badge>
                  )
                })}
              </div>
            </div>
          )
        }}
      />
      <form.Subscribe
        selector={(state) => [state.canSubmit]}
        children={([canSubmit]) => {
          return <Button disabled={!canSubmit}>Submit</Button>
        }}
      />
    </form>
  )
}
