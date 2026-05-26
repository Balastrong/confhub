import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/demo/ssr")({
  ssr: false, // Default true, can also be 'data-only'
  component: () => <div>This route opts out of server rendering</div>,
})
