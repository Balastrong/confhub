import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { createCommunity } from "~/services/community.api"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { communityQueries } from "~/services/queries"

export const CreateCommunityForm = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const createCommunityMutation = useMutation({
    mutationFn: (data: Parameters<typeof createCommunity>[0]) =>
      createCommunity(data),
    onSuccess: async (community) => {
      queryClient.invalidateQueries(communityQueries.list())
      toast.success("Community created successfully")
      router.navigate({
        to: "/communities/$communityId",
        params: { communityId: community.id.toString() },
      })
    },
  })

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    createCommunityMutation.mutate({
      data: {
        name: formData.get("name") as string,
        location: (formData.get("location") as string) || undefined,
        logoUrl: (formData.get("logoUrl") as string) || undefined,
      },
    })
  }

  return (
    <form className="flex flex-col gap-2 w-full" onSubmit={onSubmit}>
      <Label htmlFor="name">
        Name
        <Input id="name" name="name" required />
      </Label>
      <Label htmlFor="location">
        Location
        <Input id="location" name="location" />
      </Label>
      <Label htmlFor="logoUrl">
        Logo URL
        <Input id="logoUrl" name="logoUrl" type="url" />
      </Label>
      <Button disabled={createCommunityMutation.isPending}>
        Create Community
        {createCommunityMutation.isPending && (
          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
        )}
      </Button>
    </form>
  )
}
