import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { useAppForm } from "src/lib/form"
import { signIn } from "src/services/auth.api"
import { SignInSchema } from "src/services/auth.schema"

export const SignInForm = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const signInMutation = useMutation({
    mutationFn: (data: Parameters<typeof signIn>[0]) => signIn(data),
    onSuccess: (response) => {
      if (response?.error) {
        toast.error(response.error)
        return
      }

      queryClient.resetQueries()
      navigate({ to: "/" })
    },
  })

  const form = useAppForm({
    defaultValues: {
      email: import.meta.env.VITE_DEFAULT_USER_EMAIL ?? "",
      password: import.meta.env.VITE_DEFAULT_USER_PASSWORD ?? "",
    } as SignInSchema,
    onSubmit: async ({ value }) => {
      await signInMutation.mutateAsync({ data: value })
    },
  })

  return (
    <form
      className="flex flex-col gap-2 w-full"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <form.AppField
        name="email"
        children={(field) => (
          <field.TextField label="Email" required type="email" />
        )}
      />
      <form.AppField
        name="password"
        children={(field) => (
          <field.TextField label="Password" required type="password" />
        )}
      />
      <form.AppForm>
        <form.SubmitButton label="Sign In" />
      </form.AppForm>
    </form>
  )
}
