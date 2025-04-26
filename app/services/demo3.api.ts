import { createServerFn } from "@tanstack/start"
import z from "zod"

const PersonSchema = z.object({
  name: z.string(),
  age: z.number().min(0),
})

export const myServerFunction = createServerFn({ method: "POST" })
  .validator(PersonSchema)
  .handler(
    ({ data: person }) =>
      `Hello ${person.name} from the server! You are ${person.age} years old!`,
  )

myServerFunction({ data: "Foo" })
myServerFunction({ data: 29 })
myServerFunction({ data: { name: "Leonardo", age: 29 } })
