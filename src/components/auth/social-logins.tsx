import { useMutation } from "@tanstack/react-query"
import { GitHubLogoIcon } from "@radix-ui/react-icons"
import { toast } from "sonner"
import { authClient } from "~/lib/auth/client"
import { Button } from "../ui/button"

const signInWithGitHub = async () => {
  const { error } = await authClient.signIn.social({
    provider: "github",
  })

  if (error) {
    throw new Error(error.message)
  }
}

export const SocialLogins = () => {
  const githubSignInMutation = useMutation({
    mutationFn: signInWithGitHub,
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={() => githubSignInMutation.mutate()}
      disabled={githubSignInMutation.isPending}
    >
      <GitHubLogoIcon className="mr-2 h-4 w-4" />
      Continue with GitHub
    </Button>
  )
}
