import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2, User } from "lucide-react"
import { toast } from "sonner"
import { updateUser } from "src/services/auth.api"
import { authQueries } from "src/services/queries"
import { useAuthenticatedUser } from "~/lib/auth/client"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

export function ProfileCard() {
  const { user } = useAuthenticatedUser()
  const queryClient = useQueryClient()

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      toast.success("Your profile has been updated.")
      queryClient.invalidateQueries(authQueries.user())
    },
  })

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const username = formData.get("username") as string

    updateUserMutation.mutate({ data: { username } })
  }

  return (
    <form onSubmit={onSubmit}>
      <Card className="w-full max-w-md mx-auto mt-6">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage alt="User avatar" />
            <AvatarFallback>
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your personal information</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>
                Username
                <Input
                  name="username"
                  type="text"
                  defaultValue={user.name}
                  placeholder="Enter username"
                  className="mt-1"
                />
              </Label>
            </div>
            <div>
              <Label>
                Email
                <p>{user.email}</p>
              </Label>
            </div>
          </div>
          <Button
            className="w-full mt-4"
            disabled={updateUserMutation.isPending}
          >
            {updateUserMutation.isPending ? (
              <>
                Updating <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              "Update"
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  )
}
