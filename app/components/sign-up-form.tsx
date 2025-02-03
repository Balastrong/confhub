import { signUp } from "~/services/auth.api"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { useMutation } from "@tanstack/react-query"

export const SignUpForm = () => {
  const signUpMutation = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      // TODO Login?
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
        <Input id="username" name="username" />
      </Label>
      <Label htmlFor="email">
        Email
        <Input id="email" name="email" />
      </Label>
      <Label htmlFor="password">
        Password
        <Input id="password" name="password" />
      </Label>
      <Label htmlFor="confirm-password">
        Confirm Password
        <Input id="confirm-password" name="confirm-password" />
      </Label>
      <Button>Sign Up</Button>
    </form>
  )
}
