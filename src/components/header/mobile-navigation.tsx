import { Link } from "@tanstack/react-router"
import { NAV_LINKS } from "./header"

export const MobileNavigation = ({
  onLinkClick,
}: {
  onLinkClick: () => void
}) => (
  <nav role="navigation" aria-label="Main navigation">
    <div className="flex flex-col space-y-2">
      {NAV_LINKS.map(({ to, label }) => (
        <Link
          key={to}
          to={to}
          className={`px-3 py-2 text-sm hover:bg-accent rounded-md`}
          onClick={onLinkClick}
        >
          {label}
        </Link>
      ))}
    </div>
  </nav>
)
