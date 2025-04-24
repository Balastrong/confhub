import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/demo/loaders/")({
  component: () => "Welcome to the loaders demo!",
})
