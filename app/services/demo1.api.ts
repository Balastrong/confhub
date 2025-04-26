import { createServerFn } from "@tanstack/react-start"

export const myServerFunction = createServerFn().handler(
  () => "Hello from the server!",
)
