import { createServerFn } from "@tanstack/react-start"

export const getTags = createServerFn().handler(async () => {
  return ["frontend", "backend", "devops", "design", "community"]
})
