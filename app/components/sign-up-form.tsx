import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { signUp } from "~/services/auth.api"
import { authQueries } from "~/services/queries"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

export const SignUpForm = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const signUpMutation = useMutation({
    mutationFn: (data: Parameters<typeof signUp>[0]) => signUp(data),
    onSuccess: () => {
      toast.success("You have successfully signed up.")

      queryClient.invalidateQueries(authQueries.user())
      router.invalidate()
    },
  })

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const username = formData.get("username") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirm-password") as string

    signUpMutation.mutate({
      data: {
        username,
        email,
        password,
        confirmPassword,
      },
    })
  }

  return (
    <form className="flex flex-col gap-2 w-full" onSubmit={onSubmit}>
      <Label htmlFor="username">
        Username
        <Input id="username" name="username" autoComplete="off" />
      </Label>
      <Label htmlFor="email">
        Email
        <Input id="email" name="email" />
      </Label>
      <Label htmlFor="password">
        Password
        <Input id="password" name="password" type="password" />
      </Label>
      <Label htmlFor="confirm-password">
        Confirm Password
        <Input id="confirm-password" name="confirm-password" type="password" />
      </Label>
      <Button disabled={signUpMutation.isPending}>
        Sign Up
        {signUpMutation.isPending && (
          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
        )}
      </Button>
    </form>
  )
}
