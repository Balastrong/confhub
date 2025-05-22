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
      className="flex flex-col gap-2 w-full"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <form.AppField
        name="username"
        children={(field) => <field.TextField label="Username" required />}
      />
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
      <form.AppField
        name="confirmPassword"
        children={(field) => (
          <field.TextField label="Confirm Password" required type="password" />
        )}
      />
      <form.AppForm>
        <form.SubmitButton label="Sign Up" />
      </form.AppForm>
    </form>
  )
}
