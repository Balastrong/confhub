import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { updateCommunity } from "src/services/community.api"
import { communityQueries } from "src/services/queries"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

type EditCommunityFormProps = {
  communityId: number
}

export const EditCommunityForm = ({ communityId }: EditCommunityFormProps) => {
  const queryClient = useQueryClient()

  const { data: community } = useQuery(communityQueries.detail(communityId))

  const updateCommunityMutation = useMutation({
    mutationFn: updateCommunity,
    onSuccess: async () => {
      queryClient.invalidateQueries(communityQueries.list())
      queryClient.invalidateQueries(communityQueries.detail(communityId))
      toast.success("Community updated successfully")
    },
  })

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    updateCommunityMutation.mutate({
      data: {
        id: communityId,
        name: formData.get("name") as string,
        description: (formData.get("description") as string) || undefined,
        logoUrl: (formData.get("logoUrl") as string) || undefined,
        homeUrl: (formData.get("homeUrl") as string) || undefined,
      },
    })
  }

  if (!community) return null

  return (
    <form className="flex flex-col gap-2 max-w-md w-full" onSubmit={onSubmit}>
      <Label htmlFor="name">
        Name
        <Input id="name" name="name" required defaultValue={community.name} />
      </Label>
      <Label htmlFor="description">
        Description
        <Input
          id="description"
          name="description"
          defaultValue={community.description || ""}
        />
      </Label>
      <Label htmlFor="logoUrl">
        Logo URL
        <Input
          id="logoUrl"
          name="logoUrl"
          type="url"
          defaultValue={community.logoUrl || ""}
        />
      </Label>
      <Label htmlFor="homeUrl">
        Home URL
        <Input
          id="homeUrl"
          name="homeUrl"
          type="url"
          defaultValue={community.homeUrl || ""}
        />
      </Label>
      <Button disabled={updateCommunityMutation.isPending}>
        Update Community
        {updateCommunityMutation.isPending && (
          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
        )}
      </Button>
    </form>
  )
}
