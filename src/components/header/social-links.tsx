import { DiscordLogoIcon, GitHubLogoIcon } from "@radix-ui/react-icons"

const SOCIAL_LINKS = [
  {
    href: "https://github.com/Balastrong/ConfHub",
    icon: GitHubLogoIcon,
    label: "Visit ConfHub GitHub repository (opens in new tab)",
  },
  {
    href: "https://discord.gg/bqwyEa6We6",
    icon: DiscordLogoIcon,
    label: "Join ConfHub Discord server (opens in new tab)",
  },
] as const

export const SocialLinks = ({ className = "" }: { className?: string }) => (
  <div className={className} role="group" aria-label="Social media links">
    {SOCIAL_LINKS.map(({ href, icon: Icon, label }) => (
      <a
        key={href}
        href={href}
        target="_blank"
        rel="noreferrer"
        className={`p-1 rounded hover:bg-accent hover:text-accent-foreground transition-colors`}
        aria-label={label}
      >
        <Icon className="w-4 h-4" />
      </a>
    ))}
  </div>
)
