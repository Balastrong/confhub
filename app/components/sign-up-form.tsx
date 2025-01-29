import { signUp } from "~/db/auth"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

export const SignUpForm = () => {
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirm-password") as string

    try {
      await signUp({
        data: {
          email,
          password,
          confirmPassword,
        },
      })
    } catch (error) {
      // TODO Handle error
      console.log("Error", error)
    }
  }

  return (
    <form className="flex flex-col gap-2 w-full" onSubmit={onSubmit}>
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
