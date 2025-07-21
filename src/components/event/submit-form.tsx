import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import {
  Calendar,
  Globe,
  MapPin,
  Users,
  Tag,
  FileText,
  Link2,
} from "lucide-react"
import { formatDate } from "src/lib/date"
import { getEventModeConfig, EVENT_MODE_CONFIG } from "src/lib/event-modes"
import { useAppForm } from "src/lib/form"
import {
  CreateEvent,
  CreateEventSchema,
  EventModes,
  FullEvent,
} from "src/services/event.schema"
import {
  communityQueries,
  tagQueries,
  useUpsertEventMutation,
} from "src/services/queries"
import { SignedIn } from "../auth/signed-in"
import { Badge } from "../ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Checkbox } from "../ui/checkbox"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Separator } from "../ui/separator"
import { toast } from "sonner"

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
      mode: defaultEvent?.mode || "in-person",
      country: defaultEvent?.country || "",
      city: defaultEvent?.city || null,
      cfpClosingDate: defaultEvent?.cfpClosingDate || null,
      eventUrl: defaultEvent?.eventUrl || null,
      communityId: defaultEvent?.communityId || null,
      draft: defaultEvent?.draft || false,
      tags: defaultEvent?.tags || [],
    } as CreateEvent,
    validators: {
      onMount: CreateEventSchema,
      onSubmit: CreateEventSchema,
    },
    onSubmitInvalid: (errors) => {
      console.log(errors)
    },
    onSubmit: async ({ value }) => {
      try {
        const response = await upsertEventMutation.mutateAsync({
          data: {
            ...value,
            id: defaultEvent?.id,
          },
        })

        toast.success(
          `Event ${defaultEvent?.id ? "updated" : "created"} successfully!`,
        )
      } catch (error) {}

      form.reset()
    },
  })

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {defaultEvent?.id ? "Edit Event" : "Create New Event"}
        </h1>
        <p className="text-muted-foreground">
          Share your event with the community and help others discover amazing
          conferences and meetups.
        </p>
      </div>

      <form
        className="space-y-8 pb-24"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <form.AppField
                name="name"
                children={(field) => (
                  <field.TextField label="Event Name" required />
                )}
              />
              <form.AppField
                name="eventUrl"
                children={(field) => (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Link2 className="h-4 w-4" />
                      Event URL
                    </Label>
                    <field.TextField label="" />
                  </div>
                )}
              />
            </div>

            <form.AppField
              name="description"
              children={(field) => (
                <field.TextField label="Description" required />
              )}
            />

            <div className="space-y-3">
              <form.Field
                name="mode"
                children={(field) => {
                  return (
                    <div className="space-y-3">
                      <Label className="flex items-center gap-2 text-sm font-medium">
                        <Globe className="h-4 w-4" />
                        Event Mode *
                      </Label>
                      <div className="flex gap-2 flex-wrap">
                        {EventModes.map((mode) => {
                          const isSelected = field.state.value === mode
                          const modeConfig = getEventModeConfig(mode)
                          const IconComponent = modeConfig.icon
                          return (
                            <Badge
                              key={mode}
                              className="cursor-pointer px-4 py-2 text-sm transition-all hover:scale-105 flex items-center gap-2"
                              role="radio"
                              onClick={() => field.handleChange(mode)}
                              variant={isSelected ? "default" : "outline"}
                            >
                              <IconComponent className="h-4 w-4" />
                              {modeConfig.label}
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                  )
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form.Field
              name="tags"
              children={(field) => {
                return (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Select relevant tags *
                    </Label>
                    <div className="flex gap-2 flex-wrap">
                      {tags.map((tag) => {
                        const isSelected = field.state.value.includes(tag)
                        return (
                          <Badge
                            key={tag}
                            className="cursor-pointer px-3 py-1.5 text-sm transition-all hover:scale-105"
                            role="checkbox"
                            onClick={() =>
                              isSelected
                                ? field.setValue(
                                    field.state.value.filter((v) => v != tag),
                                  )
                                : field.pushValue(tag)
                            }
                            variant={isSelected ? "default" : "outline"}
                          >
                            {tag}
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                )
              }}
            />
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Date and Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <form.Field
                name="date"
                children={(field) => {
                  return (
                    <div className="space-y-2">
                      <Label
                        htmlFor={field.name}
                        className="text-sm font-medium"
                      >
                        Start Date *
                      </Label>
                      <Input
                        type="date"
                        name={field.name}
                        id={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="h-11"
                      />
                    </div>
                  )
                }}
              />
              <form.Field
                name="dateEnd"
                children={(field) => {
                  return (
                    <div className="space-y-2">
                      <Label
                        htmlFor={field.name}
                        className="text-sm font-medium"
                      >
                        End Date
                      </Label>
                      <Input
                        type="date"
                        name={field.name}
                        id={field.name}
                        value={field.state.value ?? ""}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="h-11"
                      />
                    </div>
                  )
                }}
              />
            </div>

            <form.Subscribe
              selector={(state) => [state.values.mode]}
              children={([eventMode]) => {
                if (eventMode === "online") {
                  return (
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        This is an online event - no physical location needed.
                      </p>
                    </div>
                  )
                }
                return (
                  <div className="space-y-4">
                    <Separator />
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm font-medium">
                        <MapPin className="h-4 w-4" />
                        Location Details
                      </Label>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <form.AppField
                        name="country"
                        children={(field) => (
                          <field.TextField label="Country" required />
                        )}
                      />
                      <form.AppField
                        name="city"
                        children={(field) => <field.TextField label="City" />}
                      />
                    </div>
                  </div>
                )
              }}
            />
          </CardContent>
        </Card>

        <SignedIn>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Community & Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
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
                    state.values.draft,
                  ]}
                  children={([communityId]) => {
                    if (!communityId && form.state.values.draft) {
                      form.setFieldValue("draft", false)
                    }
                    return (
                      <div className="flex items-center space-x-2 pt-6">
                        <form.Field
                          name="draft"
                          children={(field) => {
                            return (
                              <>
                                <Checkbox
                                  disabled={!communityId}
                                  name={field.name}
                                  id={field.name}
                                  checked={field.state.value ?? false}
                                  onCheckedChange={(checked) =>
                                    field.handleChange(
                                      checked === "indeterminate"
                                        ? null
                                        : checked,
                                    )
                                  }
                                />
                                <Label
                                  htmlFor={field.name}
                                  className="cursor-pointer text-sm"
                                >
                                  Mark as Draft (internal)
                                </Label>
                              </>
                            )
                          }}
                        />
                      </div>
                    )
                  }}
                />
              </div>
              {!communities?.length && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    You don't have any communities yet. Events will be published
                    publicly.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </SignedIn>

        <div className="fixed bottom-0 left-0 right-0 z-50">
          <div className="max-w-4xl mx-auto px-6">
            <Card className="shadow-lg border-primary/20 mb-6 transform transition-all duration-200 hover:shadow-xl">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                  <div className="text-center sm:text-left">
                    <p className="text-sm text-muted-foreground">
                      Ready to share your event with the community?
                    </p>
                  </div>
                  <form.AppForm>
                    <form.SubmitButton
                      label={defaultEvent?.id ? "Update Event" : "Create Event"}
                    />
                  </form.AppForm>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
