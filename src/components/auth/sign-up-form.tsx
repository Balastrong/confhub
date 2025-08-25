import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { toast } from "sonner"
import { useAppForm } from "src/lib/form"
import { SignUpSchema } from "src/services/auth.schema"
import { authClient } from "~/lib/auth/client"

const signUp = async (data: SignUpSchema) => {
  const { error } = await authClient.signUp.email({
    email: data.email,
    password: data.password,
    name: data.username,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export const SignUpForm = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const signUpMutation = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      toast.success("You have successfully signed up.")

      queryClient.resetQueries()
      router.invalidate()
    },
  })

  const form = useAppForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    } as SignUpSchema,
    onSubmit: async ({ value }) => {
      await signUpMutation.mutateAsync(value)
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
        name="username"
        children={(field) => (
          <field.TextField
            label="Username"
            required
            placeholder="Your display name"
            autoComplete="username"
          />
        )}
      />
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
            autoComplete="new-password"
            helpText="Use at least 8 characters."
            withPasswordToggle
          />
        )}
      />
      <form.AppField
        name="confirmPassword"
        children={(field) => (
          <field.TextField
            label="Confirm Password"
            required
            type="password"
            autoComplete="new-password"
            withPasswordToggle
          />
        )}
      />
      <form.AppForm>
        <form.SubmitButton label="Create account" className="w-full mt-2" />
      </form.AppForm>
    </form>
  )
}
