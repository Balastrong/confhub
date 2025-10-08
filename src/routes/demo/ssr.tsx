import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/demo/ssr")({
  ssr: true, // Default true, can also be false or 'data-only'
  loader: () => {
    console.log("Executes on the server during the initial request")
    console.log("Executes on the client for subsequent navigation")
  },
  component: () => <div>This component is rendered on the server</div>,
})
