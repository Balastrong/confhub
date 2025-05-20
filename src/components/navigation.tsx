import React from "react"
import { cn } from "src/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu"

export const Navigation = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            to="/events/submit"
          >
            Submit Event
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Communities</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex flex-col gap-2 p-4 w-[350px]">
              <NavigationMenuLink to="/communities">
                <ListItem title="Discover">Find communities to join.</ListItem>
              </NavigationMenuLink>
              <NavigationMenuLink to="/communities/management">
                <ListItem title="Participate">
                  Get more involved in your communities.
                </ListItem>
              </NavigationMenuLink>
              <NavigationMenuLink to="/communities/management/create">
                <ListItem title="Create">Start your own community.</ListItem>
              </NavigationMenuLink>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            to="/calendar"
          >
            Calendar
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"li">,
  React.ComponentPropsWithoutRef<"li">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li
      className={cn(
        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        className,
      )}
      {...props}
    >
      <div className="text-sm font-medium leading-none">{title}</div>
      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
        {children}
      </p>
    </li>
  )
})
ListItem.displayName = "ListItem"
