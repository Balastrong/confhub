"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "src/lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6
type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6"

function getHeadingTag(level: HeadingLevel): HeadingTag {
  switch (level) {
    case 1:
      return "h1"
    case 2:
      return "h2"
    case 3:
      return "h3"
    case 4:
      return "h4"
    case 5:
      return "h5"
    case 6:
    default:
      return "h6"
  }
}

type AccordionTriggerProps = React.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Trigger
> & {
  headingLevel?: HeadingLevel
}

const AccordionTrigger = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, children, headingLevel = 3, ...props }, ref) => {
  const Heading = getHeadingTag(headingLevel)
  return (
    <AccordionPrimitive.Header className="flex w-full" asChild>
      {React.createElement(
        Heading,
        { className: "flex m-0 flex-1 font-inherit font-medium" },
        <AccordionPrimitive.Trigger
          ref={ref}
          className={cn(
            "flex cursor-pointer flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
            className,
          )}
          {...props}
        >
          {children}
          <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
        </AccordionPrimitive.Trigger>,
      )}
    </AccordionPrimitive.Header>
  )
})
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <AccordionPrimitive.Content
      ref={ref}
      className={cn(
        "overflow-hidden text-sm transition-all",
        mounted &&
          "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      )}
      {...props}
    >
      <div className={cn("pb-4 pt-0", className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
})

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
