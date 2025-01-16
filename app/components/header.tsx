import { DiscordLogoIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import { createLink, getRouteApi, Link } from "@tanstack/react-router";
import { Button } from "./ui/button";

const ButtonLink = createLink(Button);

export const Header = () => {
  // const { user } = getRouteApi("__root__").useLoaderData();

  return (
    <header className="px-4 py-2 flex gap-2 items-center justify-between max-w-screen-2xl mx-auto">
      <div className="text-xl leading-loose">
        <Link to="/">ConfHub</Link>
      </div>
      <div className="flex gap-4 items-center">
        {/* {user ? (
          <Button size={"sm"}>Logout</Button>
        ) : (
          <ButtonLink size={"sm"} to="/sign-in">
            Sign In
          </ButtonLink>
        )} */}
        <ButtonLink size={"sm"} to="/sign-in">
          Sign In
        </ButtonLink>
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
