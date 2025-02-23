import { useForm } from "@tanstack/react-form"
import { useQueries, useQuery, useSuspenseQuery } from "@tanstack/react-query"
import {
  CreateEvent,
  CreateEventSchema,
  EventModes,
} from "~/services/event.schema"
import {
  communityQueries,
  tagQueries,
  useAuthenticatedUser,
  useCreateEventMutation,
} from "~/services/queries"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { formatDate } from "~/lib/date"
import { Checkbox } from "./ui/checkbox"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select"

export const SubmitForm = () => {
  const createEventMutation = useCreateEventMutation()
  const { data: tags } = useSuspenseQuery(tagQueries.list())
  const { data: communities } = useQuery(
    communityQueries.list({ ownCommunitiesOnly: true }),
  )

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      date: formatDate(new Date()),
      dateEnd: null,
      cfpUrl: null,
      mode: "In person",
      country: "",
      city: null,
      cfpClosingDate: null,
      eventUrl: null,
      communityId: null,
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
            <Label htmlFor={field.name}>
              Event Name*
              <Input
                name={field.name}
                id={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </Label>
          )
        }}
      />
      <form.Field
        name="description"
        children={(field) => {
          return (
            <Label htmlFor={field.name}>
              Description*
              <Input
                name={field.name}
                id={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </Label>
          )
        }}
      />
      <form.Field
        name="mode"
        children={(field) => {
          return (
            <div>
              <Label htmlFor={field.name}>Event Mode *</Label>
              <div className="flex gap-1 flex-wrap items-center">
                {EventModes.map((mode) => {
                  const isSelected = field.state.value === mode
                  return (
                    <Badge
                      key={mode}
                      className="cursor-pointer"
                      role="radio"
                      onClick={() => field.handleChange(mode)}
                      variant={isSelected ? "default" : "outline"}
                    >
                      {mode}
                    </Badge>
                  )
                })}
              </div>
            </div>
          )
        }}
      />
      <div className="flex gap-2">
        <form.Field
          name="date"
          children={(field) => {
            return (
              <Label htmlFor={field.name} className="flex-1">
                Date*
                <Input
                  type="date"
                  name={field.name}
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Label>
            )
          }}
        />
        <form.Field
          name="dateEnd"
          children={(field) => {
            return (
              <Label htmlFor={field.name} className="flex-1">
                End Date
                <Input
                  type="date"
                  name={field.name}
                  id={field.name}
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Label>
            )
          }}
        />
      </div>
      <form.Subscribe
        selector={(state) => [state.values.mode]}
        children={([eventMode]) => {
          if (eventMode === "Remote") {
            return null
          }
          return (
            <div className="flex gap-2">
              <form.Field
                name="country"
                children={(field) => {
                  return (
                    <Label htmlFor={field.name} className="flex-1">
                      Country
                      <Input
                        name={field.name}
                        id={field.name}
                        value={field.state.value ?? ""}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </Label>
                  )
                }}
              />
              <form.Field
                name="city"
                children={(field) => {
                  return (
                    <Label htmlFor={field.name} className="flex-1">
                      City
                      <Input
                        name={field.name}
                        id={field.name}
                        value={field.state.value ?? ""}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </Label>
                  )
                }}
              />
            </div>
          )
        }}
      />
      <form.Field
        name="communityId"
        children={(field) => {
          return (
            <Label htmlFor={field.name}>
              Community
              <Select
                value={field.state.value?.toString() ?? ""}
                onValueChange={(value) => {
                  const communityId = parseInt(value)
                  field.handleChange(isNaN(communityId) ? null : communityId)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a community" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={undefined!}>None</SelectItem>
                  {(communities ?? []).map((community) => (
                    <SelectItem
                      key={community.id}
                      value={community.id.toString()}
                    >
                      {community.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Label>
          )
        }}
      />
      <form.Subscribe
        selector={(state) => [
          state.values.communityId,
          state.values.communityDraft,
        ]}
        children={([communityId]) => {
          if (!communityId && form.state.values.communityDraft) {
            form.setFieldValue("communityDraft", false)
          }
          return (
            <form.Field
              name="communityDraft"
              children={(field) => {
                return (
                  <div className="flex items-center gap-1">
                    <Checkbox
                      disabled={!communityId}
                      name={field.name}
                      id={field.name}
                      checked={field.state.value ?? false}
                      onCheckedChange={(checked) =>
                        field.handleChange(
                          checked === "indeterminate" ? null : checked,
                        )
                      }
                    />
                    <Label htmlFor={field.name} className="cursor-pointer">
                      Mark as Draft (internal)
                    </Label>
                  </div>
                )
              }}
            />
          )
        }}
      />
      <form.Field
        name="eventUrl"
        children={(field) => {
          return (
            <Label htmlFor={field.name}>
              Event URL
              <Input
                name={field.name}
                id={field.name}
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </Label>
          )
        }}
      />
      <form.Field
        name="cfpUrl"
        children={(field) => {
          return (
            <Label htmlFor={field.name}>
              CFP URL
              <Input
                name={field.name}
                id={field.name}
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </Label>
          )
        }}
      />
      <form.Field
        name="cfpClosingDate"
        children={(field) => {
          return (
            <Label htmlFor={field.name}>
              CFP Closing Date
              <Input
                type="date"
                name={field.name}
                id={field.name}
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </Label>
          )
        }}
      />
      <form.Field
        name="tags"
        children={(field) => {
          return (
            <div>
              <Label htmlFor={field.name}>Tags *</Label>
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
