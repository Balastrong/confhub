import { DiscordLogoIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createLink, Link, useRouter } from "@tanstack/react-router";
import { signOut } from "~/db/auth";
import { authQueries } from "~/queries";
import { Button } from "./ui/button";

const ButtonLink = createLink(Button);

export const Header = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: authState } = useQuery(authQueries.user());

  return (
    <header className="px-4 py-2 flex gap-2 items-center justify-between max-w-screen-2xl mx-auto">
      <div className="text-xl leading-loose flex gap-2">
        <Link to="/">ConfHub</Link>
        <Link to="/test">Test</Link>
      </div>
      <div className="flex gap-4 items-center">
        {authState?.isAuthenticated ? (
          <Button
            size={"sm"}
            onClick={() =>
              signOut().then(async () => {
                queryClient.invalidateQueries(authQueries.user());
                router.invalidate();
              })
            }
          >
            Logout
          </Button>
        ) : (
          <ButtonLink size={"sm"} to="/sign-in">
            Sign In
          </ButtonLink>
        )}
        <a
          href="https://github.com/Balastrong/ConfHub"
          target="_blank"
          rel="noreferrer"
        >
          <GitHubLogoIcon />
        </a>
        <a
          href="https://discord.gg/bqwyEa6We6"
          target="_blank"
          rel="noreferrer"
        >
          <DiscordLogoIcon />
        </a>
      </div>
    </header>
  );
};
