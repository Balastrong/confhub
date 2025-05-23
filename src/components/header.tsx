import { DiscordLogoIcon, GitHubLogoIcon } from "@radix-ui/react-icons"
import { Link } from "@tanstack/react-router"
import { SignedIn } from "./auth/signed-in"
import { SignedOut } from "./auth/signed-out"
import { ButtonLink } from "./button-link"
import { Navigation } from "./navigation"
import { UserMenu } from "./user-menu"

export const Header = () => {
  return (
    <header className="px-4 py-2 flex gap-2 items-center justify-between max-w-screen-2xl mx-auto">
      <div className="flex gap-2 items-center">
        <div className="text-xl leading-loose mr-2">
          <Link to="/">ConfHub</Link>
        </div>
        <Navigation />
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
        <SignedIn>
          <UserMenu />
        </SignedIn>
        <SignedOut>
          <ButtonLink size={"sm"} to="/sign-in">
            Sign In
          </ButtonLink>
        </SignedOut>
      </div>
    </header>
  )
}
