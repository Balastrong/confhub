import { useRouterState } from "@tanstack/react-router"
import { Link1Icon } from "@radix-ui/react-icons"

export const UrlBar = () => {
  const { location } = useRouterState()

  return (
    <div className="sticky top-0 z-10 w-full bg-muted border-b border-border py-3 px-4 flex items-center justify-center shadow-sm">
      <div className="max-w-screen-lg w-full flex items-center gap-4">
        <div className="flex-1 flex items-center overflow-auto">
          <div className="flex w-full shadow-inner items-center p-2 gap-2 rounded-xl bg-background border">
            <Link1Icon className="size-5" />
            <span
              className="text-sm w-full overflow-x-auto whitespace-nowrap max-w-full"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {location.pathname}
              <span className="font-semibold">{location.searchStr}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
