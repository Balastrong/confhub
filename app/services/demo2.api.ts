import { createServerFn } from "@tanstack/start"

export const myServerFunction = createServerFn({ method: "POST" })
  .validator((data): number => {
    if (typeof data !== "number") {
      throw new Error("Invalid data type")
    }

    return data
  })
  .handler(
    ({ data: age }) => `Hello from the server! You are ${age} years old!`,
  )

myServerFunction({ data: "Foo" })
myServerFunction({ data: 29 })
