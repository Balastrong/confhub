import { useMutation, useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Link2, Send, Users } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { ButtonLink } from "~/components/button-link"
import { seo } from "~/lib/seo"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { useAppForm } from "~/lib/form"
import { createEventRequest } from "~/services/event-request.api"
import { CreateEventRequestSchema } from "~/services/event-request.schema"
import { useTranslation } from "react-i18next"
import i18n from "~/lib/i18n"
import {
  eventRequestQueries,
  useCreateEventRequestMutation,
} from "~/services/queries"

export const Route = createFileRoute("/events/submit")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(eventRequestQueries.count())
  },
  head: () => ({
    meta: seo({
      title: i18n.t("submit.seoTitle"),
      description: i18n.t("submit.seoDescription"),
    }),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()
  const { data: eventRequestCount = 0 } = useQuery(eventRequestQueries.count())
  const createEventRequestMutation = useCreateEventRequestMutation()

  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useAppForm({
    defaultValues: {
      url: "",
    },
    validators: {
      onMount: CreateEventRequestSchema,
      onChange: CreateEventRequestSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await createEventRequestMutation.mutateAsync({
          data: value,
        })
        toast.success(t("submit.toast.success"))
        setIsSubmitted(true)
      } catch (error: any) {
        toast.error(error.message || t("submit.toast.error"))
      }
    },
  })

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">
              {t("submit.success.title")}
            </CardTitle>
            <CardDescription className="text-center">
              {t("submit.success.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-green-700 dark:text-green-300 text-center">
                {t("submit.success.hint")}
              </p>
            </div>
            <div className="flex justify-center mt-4">
              <ButtonLink variant="outline" to={"/"}>
                {t("submit.success.backHome")}
              </ButtonLink>
              <Button
                onClick={() => {
                  form.reset()
                  setIsSubmitted(false)
                }}
                className="ml-4"
              >
                {t("submit.success.another")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("submit.header")}
        </h1>
        <p className="text-muted-foreground">{t("submit.description")}</p>
      </div>

      {/* Event Request Counter */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-lg">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {eventRequestCount}
            </span>{" "}
            events submitted by the community
          </span>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>{t("submit.card.title")}</CardTitle>
          <CardDescription>{t("submit.card.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
            className="space-y-6"
          >
            <div className="space-y-3">
              <form.AppField
                name="url"
                children={(field) => (
                  <field.TextField
                    label={
                      <>
                        <Link2 className="h-4 w-4" />{" "}
                        {t("submit.form.urlLabel")}
                      </>
                    }
                    required
                    type="url"
                  />
                )}
              />
            </div>
            <form.AppForm>
              <form.SubmitButton
                label={t("submit.form.submit")}
                className="w-full"
              />
            </form.AppForm>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
