import { createServerFn } from "@tanstack/start"

export const myServerFunction = createServerFn().handler(
  () => "Hello from the server!",
)
