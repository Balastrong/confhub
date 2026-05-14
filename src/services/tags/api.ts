import { createServerFn } from "@tanstack/react-start"
import { tagsService } from "./service.server"

export const getTags = createServerFn({ method: "GET" }).handler(async () => {
  return tagsService.getTags()
})
