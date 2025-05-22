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

export const SignInForm = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const signInMutation = useMutation({
    mutationFn: signIn,
    onSuccess: (response) => {
      toast.success(`Hey ${response.user.name}, welcome back!`)

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
      await signInMutation.mutateAsync(value)
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
