import { createServerFn } from "@tanstack/react-start"

export const mySimpleServerFunction = createServerFn().handler(() => {
  return "Hello from the server!"
})

export const myValidatedServerFunction = createServerFn()
  .inputValidator((data: number) => {
    if (typeof data !== "number") {
      throw new Error("Invalid data type")
    }

    return data
  })
  .handler(
    ({ data: age }) => `Hello from the server! You are ${age} years old!`,
  )

myValidatedServerFunction({ data: "Foo" })
myValidatedServerFunction({ data: 29 })

import { z } from "zod"

const PersonSchema = z.object({ name: z.string(), age: z.number().min(0) })

export const myReallyCoolServerFunction = createServerFn({ method: "POST" })
  .inputValidator(PersonSchema)
  .handler(({ data: person }) => {
    // You can safely access the database here
    return `Hello ${person.name} from the server! You are ${person.age} years old!`
  })

myReallyCoolServerFunction({ data: "Foo" })
myReallyCoolServerFunction({ data: 29 })
myReallyCoolServerFunction({ data: { name: "Leonardo", age: 30 } })
