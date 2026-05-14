import { createMiddleware } from "@tanstack/react-start"

export const loggingMiddleware = createMiddleware().server(async ({ next }) => {
  console.log("Just before calling the server function...")
  const result = await next()
  console.log("Just after calling the server function...")
  return result
})
