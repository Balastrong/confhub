import { GitHubLogoIcon } from "@radix-ui/react-icons"
import { useIsMutating, useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { authClient } from "~/lib/auth/client"
import { Button } from "../ui/button"

const signInWithGitHub = async (callbackURL?: string) => {
  const { error } = await authClient.signIn.social({
    provider: "github",
    callbackURL,
  })

  if (error) {
    throw new Error(error.message)
  }
}

const signInWithGoogle = async (callbackURL?: string) => {
  const { error } = await authClient.signIn.social({
    provider: "google",
    callbackURL,
  })

  if (error) {
    throw new Error(error.message)
  }
}

type SocialLoginsProps = {
  callbackURL?: string
}
export const SocialLogins = ({ callbackURL }: SocialLoginsProps) => {
  const isAuthLoading = useIsMutating({ mutationKey: ["auth"] }) > 0

  const githubSignInMutation = useMutation({
    mutationKey: ["auth", "github"],
    mutationFn: () => signInWithGitHub(callbackURL),
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const googleSignInMutation = useMutation({
    mutationKey: ["auth", "google"],
    mutationFn: () => signInWithGoogle(callbackURL),
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="w-full"
        onClick={() => githubSignInMutation.mutate()}
        disabled={isAuthLoading}
      >
        <GitHubLogoIcon className="mr-2 h-4 w-4" />
        Continue with GitHub
      </Button>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="w-full"
        onClick={() => googleSignInMutation.mutate()}
        disabled={isAuthLoading}
      >
        {/* Simple Google G icon SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          className="mr-2 h-4 w-4"
          aria-hidden
        >
          <path
            fill="#FFC107"
            d="M43.611 20.083H42V20H24v8h11.303C33.602 32.441 29.223 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C33.641 6.053 29.04 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20c0-1.341-.138-2.651-.389-3.917z"
          />
          <path
            fill="#FF3D00"
            d="M6.306 14.691l6.571 4.817C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C33.641 6.053 29.04 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
          />
          <path
            fill="#4CAF50"
            d="M24 44c5.166 0 9.808-1.977 13.324-5.186l-6.152-5.206C29.176 35.091 26.715 36 24 36c-5.202 0-9.569-3.538-11.289-8.313l-6.557 5.047C9.472 39.556 16.227 44 24 44z"
          />
          <path
            fill="#1976D2"
            d="M43.611 20.083H42V20H24v8h11.303c-1.32 3.441-4.382 6.091-8.303 6.091-5.202 0-9.569-3.538-11.289-8.313l-6.557 5.047C9.472 39.556 16.227 44 24 44c8.822 0 16.221-5.977 18.611-14.083.555-2.017.855-4.153.855-6.417 0-1.341-.138-2.651-.389-3.917z"
          />
        </svg>
        Continue with Google
      </Button>
    </div>
  )
}
