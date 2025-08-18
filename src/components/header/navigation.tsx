import React from "react"
import { cn } from "src/lib/utils"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu"
import { NAV_LINKS } from "./header"

export const Navigation = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {NAV_LINKS.map(({ to, label }) => (
          <NavigationMenuItem key={to}>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              to={to}
            >
              {label}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
