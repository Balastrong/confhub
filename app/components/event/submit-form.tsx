import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { formatDate } from "~/lib/date"
import { useAppForm } from "~/lib/form"
import {
  CreateEvent,
  CreateEventSchema,
  EventModes,
  FullEvent,
} from "~/services/event.schema"
import {
  communityQueries,
  tagQueries,
  useUpsertEventMutation,
} from "~/services/queries"
import { SignedIn } from "../auth/SignedIn"
import { Badge } from "../ui/badge"
import { Checkbox } from "../ui/checkbox"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

type SubmitFormProps = {
  defaultEvent?: Partial<FullEvent>
}

export const SubmitForm = ({ defaultEvent }: SubmitFormProps = {}) => {
  const upsertEventMutation = useUpsertEventMutation()
  const { data: tags } = useSuspenseQuery(tagQueries.list())
  const { data: communities } = useQuery(
    communityQueries.list({ ownCommunitiesOnly: true }),
  )

  const form = useAppForm({
    defaultValues: {
      name: defaultEvent?.name || "",
      description: defaultEvent?.description || "",
      date: defaultEvent?.date || formatDate(new Date()),
      dateEnd: defaultEvent?.dateEnd || null,
      cfpUrl: defaultEvent?.cfpUrl || null,
      mode: defaultEvent?.mode || "In person",
      country: defaultEvent?.country || "",
      city: defaultEvent?.city || null,
      cfpClosingDate: defaultEvent?.cfpClosingDate || null,
      eventUrl: defaultEvent?.eventUrl || null,
      communityId: defaultEvent?.communityId || null,
      tags: defaultEvent?.tags?.map((t) => t.id) || [],
    } as CreateEvent,
    validators: {
      onMount: CreateEventSchema,
      onSubmit: CreateEventSchema,
    },
    onSubmitInvalid: (errors) => {
      console.log(errors)
    },
    onSubmit: async ({ value }) => {
      console.log("submit", value)
      try {
        await upsertEventMutation.mutateAsync({
          data: {
            ...value,
            id: defaultEvent?.id,
          },
        })
      } catch (error) {}

      form.reset()
    },
  })

  return (
    <form
      className="flex flex-col gap-4 w-full"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      {/* Basic Information Section */}
      <section className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        <form.AppField
          name="name"
          children={(field) => <field.TextField label="Event Name" required />}
        />
        <form.AppField
          name="description"
          children={(field) => <field.TextField label="Description" required />}
        />
        <div className="flex gap-2">
          <form.Field
            name="mode"
            children={(field) => {
              return (
                <div>
                  <Label htmlFor={field.name}>Event Mode *</Label>
                  <div className="flex gap-1 flex-wrap items-center mt-2">
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
          <div className="flex-1">
            <form.AppField
              name="eventUrl"
              children={(field) => <field.TextField label="Event URL" />}
            />
          </div>
        </div>
      </section>

      {/* Date and Location Section */}
      <section className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold">Date and Location</h3>
        <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
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

          <form.Subscribe
            selector={(state) => [state.values.mode]}
            children={([eventMode]) => {
              if (eventMode === "Remote") {
                return null
              }
              return (
                <>
                  <form.AppField
                    name="country"
                    children={(field) => <field.TextField label="Country" />}
                  />
                  <form.AppField
                    name="city"
                    children={(field) => <field.TextField label="City" />}
                  />
                </>
              )
            }}
          />
        </div>
      </section>

      {/* Community and Draft Section */}
      <SignedIn>
        <section className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold">Community</h3>
          <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
            <form.AppField
              name="communityId"
              children={(field) => (
                <field.SelectField
                  label="Community"
                  type="number"
                  options={[
                    { value: undefined!, label: "None" },
                    ...(communities ?? []).map((community) => ({
                      value: community.id,
                      label: community.name,
                    })),
                  ]}
                />
              )}
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
                        <div className="flex items-center gap-1 mt-3">
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
                          <Label
                            htmlFor={field.name}
                            className="cursor-pointer"
                          >
                            Mark as Draft (internal)
                          </Label>
                        </div>
                      )
                    }}
                  />
                )
              }}
            />
          </div>
        </section>
      </SignedIn>

      {/* URL Information Section */}
      <section className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold">Call For Paper</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div>
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
          </div>
          <div className="col-span-2">
            <form.AppField
              name="cfpUrl"
              children={(field) => <field.TextField label="CFP URL" />}
            />
          </div>
        </div>
      </section>

      {/* Tags Section */}
      <section className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold">Tags</h3>
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
      </section>

      {/* Submit Button */}
      <form.AppForm>
        <form.SubmitButton label="Submit" />
      </form.AppForm>
    </form>
  )
}
