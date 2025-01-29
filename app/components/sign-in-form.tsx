import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { Loader2 } from "lucide-react"
import { signIn } from "~/db/auth"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { authQueries } from "~/queries"

export const SignInForm = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const signInMutation = useMutation({
    mutationFn: signIn,
    onSuccess: () => {
      navigate({ to: "/" })
      queryClient.invalidateQueries(authQueries.user())
    },
    onError: (error) => {
      console.error(error.message)
    },
  })

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    signInMutation.mutate({ data: { email, password } })
  }

  return (
    <form className="flex flex-col gap-2 w-full" onSubmit={onSubmit}>
      <Label htmlFor="email">
        Email
        <Input
          id="email"
          name="email"
          defaultValue={import.meta.env.VITE_DEFAULT_USER_EMAIL}
        />
      </Label>
      <Label htmlFor="password">
        Password
        <Input
          id="password"
          name="password"
          defaultValue={import.meta.env.VITE_DEFAULT_USER_PASSWORD}
        />
      </Label>
      <Button disabled={signInMutation.isPending}>
        Sign In
        {signInMutation.isPending && (
          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
        )}
      </Button>
    </form>
  )
}
