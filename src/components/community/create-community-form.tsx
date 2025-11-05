import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { Users, FileText, Image, Globe, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { createCommunity } from "src/services/community.api"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { communityQueries } from "src/services/queries"

export const CreateCommunityForm = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const createCommunityMutation = useMutation({
    mutationFn: createCommunity,
    onSuccess: async (community) => {
      queryClient.invalidateQueries(communityQueries.list())
      toast.success("Community created successfully")
      router.navigate({
        to: "/communities/$communitySlug",
        params: { communitySlug: community.slug },
      })
    },
  })

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    createCommunityMutation.mutate({
      data: {
        name: formData.get("name") as string,
        description: (formData.get("description") as string) || undefined,
        logoUrl: (formData.get("logoUrl") as string) || undefined,
        homeUrl: (formData.get("homeUrl") as string) || undefined,
      },
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">
            Create a Community
          </h1>
        </div>
        <p className="text-muted-foreground">
          Build a space for your community to connect, share, and grow together.
        </p>
      </div>

      <form className="space-y-6" onSubmit={onSubmit}>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Community Name *
              </Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="e.g., React Developers"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Tell us about your community..."
                className="min-h-[100px] resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Help others understand what your community is about
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Branding & Links
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logoUrl" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                Logo URL
              </Label>
              <Input
                id="logoUrl"
                name="logoUrl"
                type="url"
                placeholder="https://example.com/logo.png"
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">
                Link to your community's logo or avatar
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="homeUrl" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Homepage URL
              </Label>
              <Input
                id="homeUrl"
                name="homeUrl"
                type="url"
                placeholder="https://example.com"
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">
                Your community's website or main platform
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
          <Button
            size="lg"
            disabled={createCommunityMutation.isPending}
            className="min-w-[200px]"
          >
            {createCommunityMutation.isPending ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Create Community
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
