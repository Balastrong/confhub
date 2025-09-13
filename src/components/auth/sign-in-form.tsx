import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { useAppForm } from "src/lib/form"
import { SignInSchema } from "src/services/auth.schema"
import { authClient } from "~/lib/auth/client"

const signIn = async (data: SignInSchema) => {
  const { error, data: response } = await authClient.signIn.email({
    email: data.email,
    password: data.password,
  })

  if (error) {
    throw new Error(error.message)
  }

  return response
}

export const SignInForm = ({ redirectTo = "/" }: { redirectTo?: string }) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const signInMutation = useMutation({
    mutationFn: signIn,
    onSuccess: (response) => {
      toast.success(`Hey ${response.user.name}, welcome back!`)

      queryClient.resetQueries()
      navigate({ to: redirectTo })
    },
  })

  const form = useAppForm({
    defaultValues: {
      email: import.meta.env.VITE_DEFAULT_USER_EMAIL ?? "",
      password: import.meta.env.VITE_DEFAULT_USER_PASSWORD ?? "",
    } as SignInSchema,
    onSubmit: async ({ value }) => {
      await signInMutation.mutateAsync(value)
    },
  })

  return (
    <form
      className="flex flex-col gap-3 w-full"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <form.AppField
        name="email"
        children={(field) => (
          <field.TextField
            label="Email"
            required
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
          />
        )}
      />
      <form.AppField
        name="password"
        children={(field) => (
          <field.TextField
            label="Password"
            required
            type="password"
            autoComplete="current-password"
            withPasswordToggle
          />
        )}
      />
      <form.AppForm>
        <form.SubmitButton label="Sign in" className="w-full mt-2" />
      </form.AppForm>
    </form>
  )
}
