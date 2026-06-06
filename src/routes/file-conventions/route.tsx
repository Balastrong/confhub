import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/file-conventions")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <header>File Conventions</header>
      <Outlet />
      <footer>Footer</footer>
    </div>
  )
}
