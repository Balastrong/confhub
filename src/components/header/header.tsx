import { HamburgerMenuIcon } from "@radix-ui/react-icons"
import { Link } from "@tanstack/react-router"
import { useEffect, useRef, useState } from "react"
import { SignedIn } from "../auth/signed-in"
import { SignedOut } from "../auth/signed-out"
import { ButtonLink } from "../button-link"
import { ThemeSelector } from "../theme-selector"
import { Button } from "../ui/button"
import { UserMenu } from "../user-menu"
import { MobileNavigation } from "./mobile-navigation"
import { Navigation } from "./navigation"
import { SocialLinks } from "./social-links"

export const NAV_LINKS = [
  { to: "/events/submit", label: "Submit Event" },
  { to: "/communities", label: "Communities" },
  { to: "/calendar", label: "Calendar" },
] as const

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
        mobileMenuButtonRef.current?.focus()
      }
    }

    document.addEventListener("keydown", handleEscapeKey)
    return () => document.removeEventListener("keydown", handleEscapeKey)
  }, [isMobileMenuOpen])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="px-4 py-2 max-w-screen-2xl mx-auto" role="banner">
      {/* Desktop Header */}
      <div className="flex gap-2 items-center justify-between">
        <div className="flex gap-2 items-center">
          <div className="text-xl leading-loose mr-2">
            <Link
              to="/"
              className={`rounded hover:text-accent transition-colors`}
            >
              ConfHub
            </Link>
          </div>
          {/* Desktop Navigation - hidden on mobile */}
          <div className="hidden md:block">
            <Navigation />
          </div>
        </div>

        {/* Desktop Right Side - partially hidden on mobile */}
        <div className="flex gap-2 md:gap-4 items-center">
          {/* Social icons - hidden on small screens */}
          <SocialLinks className="hidden sm:flex gap-2 md:gap-4 items-center" />

          {/* Theme selector - always visible */}
          <ThemeSelector />

          {/* User menu / Sign in - always visible */}
          <SignedIn>
            <UserMenu />
          </SignedIn>
          <SignedOut>
            <ButtonLink
              size={"sm"}
              to="/sign-in"
              className="hidden sm:inline-flex"
            >
              Sign In
            </ButtonLink>
            <ButtonLink
              size={"sm"}
              to="/sign-in"
              className="sm:hidden px-2 py-1 text-xs"
            >
              Sign In
            </ButtonLink>
          </SignedOut>

          {/* Mobile menu button - only visible on mobile */}
          <Button
            ref={mobileMenuButtonRef}
            variant="ghost"
            size="sm"
            className="md:hidden p-1"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={
              isMobileMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
          >
            <HamburgerMenuIcon className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          ref={mobileMenuRef}
          className="md:hidden mt-4 pb-4 border-t pt-4"
          role="navigation"
          aria-label="Mobile navigation menu"
        >
          <div className="flex flex-col space-y-3">
            <MobileNavigation onLinkClick={closeMobileMenu} />
            <SocialLinks className="sm:hidden flex gap-4 px-3 py-2" />
          </div>
        </div>
      )}
    </header>
  )
}
