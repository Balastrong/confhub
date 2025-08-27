import { createServerFn } from "@tanstack/react-start"
import z from "zod"
import { EventFiltersSchema } from "./event.schema"
import { userRequiredMiddleware } from "./auth.api"
import OpenAI from "openai"
import { getTags } from "./tags.api"
import { getCountries } from "./countries.api"

const token = process.env["GITHUB_TOKEN"]
const endpoint = "https://models.github.ai/inference"
const model = "openai/gpt-4.1-nano"

export const generateFiltersSchema = createServerFn({ method: "POST" })
  .validator(z.string())
  .middleware([userRequiredMiddleware])
  .handler(async ({ data }) => {
    // TODO Count/Rate limit user

    const client = new OpenAI({ baseURL: endpoint, apiKey: token })

    const tags = await getTags()
    const countries = await getCountries()

    const systemPrompt = `You are a helpful assistant that extracts structured information from user requests.
The user will describe how they want an events list to be filtered.
Use the following schema:
z.object({
    tags: z.array(z.string()), // possible values: ${tags.join(", ")}
    modes: z.array(z.enum(["in-person", "hybrid", "online"])),
    country: z.string(), // Use only if user specified a country and value is in: ${countries.join(", ")}
    hasCfpOpen: z.boolean(),
    startDate: z.string().date().nullish(),
  })
Only reply with the JSON, and make sure it follows the schema. Do not use null, skip the keys if they are not relevant.
Today is ${new Date().toISOString()}.`

    const response = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        { role: "user", content: data },
      ],
      temperature: 1.0,
      top_p: 1.0,
      model: model,
    })

    const aiSchema = response.choices[0].message.content

    return EventFiltersSchema.parse(JSON.parse(aiSchema!))
  })
