import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Camera, Loader2, User } from "lucide-react"
import { useState } from "react"
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "./ui/dialog"

export function ProfileCard() {
  const { user } = useAuthenticatedUser()
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false)
  const [pendingImageUrl, setPendingImageUrl] = useState("")
  const queryClient = useQueryClient()

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      toast.success("Your profile has been updated.")
      queryClient.invalidateQueries(authQueries.user())
      setAvatarDialogOpen(false)
      setPendingImageUrl("")
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
          <Dialog open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="relative cursor-pointer group h-16 w-16 rounded-full overflow-hidden focus:outline-hidden focus:ring-2 focus:ring-ring"
                onClick={() => {
                  setPendingImageUrl(user.image ?? "")
                }}
              >
                <Avatar className="h-full w-full">
                  <AvatarImage alt="User avatar" src={user.image ?? ""} />
                  <AvatarFallback>
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-xs text-white">
                  <Camera className="h-5 w-5 mb-1" />
                  <span>Change</span>
                </div>
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Avatar</DialogTitle>
                <DialogDescription>
                  Paste a direct image URL (PNG, JPG, GIF). It will be saved to
                  your profile.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  placeholder="https://example.com/avatar.png"
                  value={pendingImageUrl}
                  onChange={(e) => setPendingImageUrl(e.target.value)}
                  disabled={updateUserMutation.isPending}
                />
                {pendingImageUrl && (
                  <div className="mt-4 flex items-center gap-3">
                    <img
                      src={pendingImageUrl}
                      alt="Preview"
                      className="h-12 w-12 rounded-full object-cover border"
                      onError={(e) => {
                        ;(e.currentTarget as HTMLImageElement).style.opacity =
                          "0.3"
                      }}
                    />
                    <span className="text-xs text-muted-foreground">
                      Preview
                    </span>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAvatarDialogOpen(false)}
                  disabled={updateUserMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    const url = pendingImageUrl.trim()
                    if (!url) {
                      toast.error("Image URL cannot be empty")
                      return
                    }
                    updateUserMutation.mutate({
                      data: { username: user.name, imageUrl: url },
                    })
                  }}
                  disabled={updateUserMutation.isPending}
                >
                  {updateUserMutation.isPending ? (
                    <>
                      Saving <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
