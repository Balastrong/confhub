import { DiscordLogoIcon, GitHubLogoIcon } from "@radix-ui/react-icons"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createLink, Link } from "@tanstack/react-router"
import { authQueries } from "~/services/queries"
import { Button } from "./ui/button"
import { UserMenu } from "./user-menu"
import { ButtonLink } from "./button-link"

export const Header = () => {
  const { data: authState } = useSuspenseQuery(authQueries.user())

  return (
    <header className="px-4 py-2 flex gap-2 items-center justify-between max-w-screen-2xl mx-auto">
      <div className="flex gap-2 items-center">
        <div className="text-xl leading-loose mr-2">
          <Link to="/">ConfHub</Link>
        </div>
        {authState.isAuthenticated && (
          <>
            <ButtonLink size={"sm"} variant={"outline"} to={"/review/submit"}>
              Submit
            </ButtonLink>
            <ButtonLink size={"sm"} variant={"outline"} to={"/community"}>
              Community
            </ButtonLink>
            <ButtonLink
              size={"sm"}
              variant={"outline"}
              to={"/community/management/create"}
            >
              Create Community
            </ButtonLink>
          </>
        )}
      </div>
      <div className="flex gap-4 items-center">
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
        {authState.isAuthenticated ? (
          <UserMenu />
        ) : (
          <ButtonLink size={"sm"} to="/sign-in">
            Sign In
          </ButtonLink>
        )}
      </div>
    </header>
  )
}
