import { Loader2, User } from "lucide-react"
import { authQueries, useAuthenticatedUser } from "~/services/queries"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateUser } from "~/services/auth.api"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { useState } from "react"

export function ProfileCard() {
  const {
    data: { user },
  } = useAuthenticatedUser()
  const queryClient = useQueryClient()
  const [username, setUsername] = useState(user.meta.username ?? "")

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries(authQueries.user())
    },
  })

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src="/placeholder.svg" alt="User avatar" />
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
            <p className="text-sm font-medium text-muted-foreground">
              Username
            </p>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="mt-1"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <p className="text-base">{user.email}</p>
          </div>
        </div>
        <Button
          className="w-full mt-4"
          onClick={() => updateUserMutation.mutate({ data: { username } })}
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
  )
}
