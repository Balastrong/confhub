import { useMutation } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Link2, Send } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { ButtonLink } from "~/components/button-link"
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

export const Route = createFileRoute("/events/submit")({
  component: RouteComponent,
})

function RouteComponent() {
  const createEventRequestMutation = useMutation({
    mutationFn: createEventRequest,
    onSuccess: () => {
      toast.success("Event request submitted successfully!")
      setIsSubmitted(true)
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit event request")
    },
  })
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
      await createEventRequestMutation.mutateAsync({
        data: value,
      })
    },
  })

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Thank You!</CardTitle>
            <CardDescription className="text-center">
              Your event request has been submitted successfully.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-green-700 dark:text-green-300 text-center">
                Our team will review your event soon and add it to the platform.
              </p>
            </div>
            <div className="flex justify-center mt-4">
              <ButtonLink variant="outline" to={"/"}>
                Return to Homepage
              </ButtonLink>
              <Button
                onClick={() => {
                  form.reset()
                  setIsSubmitted(false)
                }}
                className="ml-4"
              >
                Submit Another Request
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
        <h1 className="text-3xl font-bold tracking-tight">Submit an Event</h1>
        <p className="text-muted-foreground">
          Share an event with the community by submitting the URL below.
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Event Request</CardTitle>
          <CardDescription>
            Enter the URL of the event you'd like to see on our platform.
          </CardDescription>
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
                        <Link2 className="h-4 w-4" /> Event URL
                      </>
                    }
                    required
                    type="url"
                  />
                )}
              />
            </div>
            <form.AppForm>
              <form.SubmitButton label={"Submit Event"} className="w-full" />
            </form.AppForm>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
