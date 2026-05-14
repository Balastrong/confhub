import OpenAI from "openai"
import { EventFiltersSchema } from "~/services/event/schema"
import { countriesService } from "~/services/countries/service.server"
import { tagsService } from "~/services/tags/service.server"
import { rateLimitGuard } from "./rate-limit"

function extractFirstJsonObject(input: string): string | null {
  const start = input.indexOf("{")

  if (start === -1) {
    return null
  }

  let depth = 0

  for (let index = start; index < input.length; index++) {
    const char = input[index]

    if (char === "{") {
      depth++
    } else if (char === "}") {
      depth--

      if (depth === 0) {
        return input.slice(start, index + 1)
      }
    }
  }

  return null
}

function safeParseJson(text: string): unknown {
  let value = text

  if (value.toLowerCase().includes("</think>")) {
    value = value.replace(/<think[\s\S]*?<\/think>/gi, "")
    const lowerValue = value.toLowerCase()
    const lastClose = lowerValue.lastIndexOf("</think>")

    if (lastClose !== -1) {
      value = value.slice(lastClose + "</think>".length)
    }
  }

  let trimmed = value.trim()

  if (trimmed.startsWith("```")) {
    trimmed = trimmed.replace(/^```(?:json)?\s*/i, "")
    trimmed = trimmed.replace(/\s*```\s*$/i, "")
    trimmed = trimmed.trim()
  }

  try {
    return JSON.parse(trimmed)
  } catch {
    const extracted = extractFirstJsonObject(value)

    if (extracted) {
      return JSON.parse(extracted)
    }

    return JSON.parse(trimmed)
  }
}

export async function generateFilters(userId: string, prompt: string) {
  await rateLimitGuard({
    prefix: "ai:generateFiltersSchema:",
    userId,
    windows: [
      { name: "min", limit: 5, windowSec: 60 },
      { name: "day", limit: 15, windowSec: 60 * 60 * 24 },
    ],
  })

  const token = process.env.LLM_TOKEN!
  const endpoint = process.env.LLM_ENDPOINT!
  const model = process.env.LLM_MODEL!
  const client = new OpenAI({ baseURL: endpoint, apiKey: token })
  const tags = await tagsService.getTags()
  const countries = await countriesService.getCountries()

  const systemPrompt = [
    "Extract event filters and return JSON only.",
    "Allowed keys ONLY: tags, modes, country, hasCfpOpen, startDate.",
    "Omit any key that isn't clearly needed by the user prompt. Do not guess values, EXCEPT tags may be derived from clear hints.",
    "tags: up to 3; derive from clear hints; map to closest in valid tags; lowercase; strip '#'; dedupe; if no match, omit.",
    "modes: allowed: 'in-person', 'hybrid', 'online'.",
    "country: must be one of valid countries; do not infer from cities/regions.",
    "hasCfpOpen: true for open/accepting; false for closed.",
    "startDate: format YYYY-MM-DD;",
    "If needed for relative dates, today is " + new Date(),
    `Valid tags: ${tags.join(", ")}`,
    `Valid countries: ${countries.join(", ")}`,
    "Output JSON only, no prose or code fences; no nulls or empty arrays; return {} if nothing applies.",
    "Example → User: online React events on 2025-09-15",
    'Output: {"tags":["react"],"modes":["online"],"startDate":"2025-09-15"}',
    "Do not use null or empty strings, omit keys instead.",
  ].join("\n")

  const response = await client.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      { role: "user", content: prompt },
    ],
    model,
  })

  const aiSchema = response.choices[0].message.content?.trim()

  if (!aiSchema) {
    throw new Response(
      JSON.stringify({
        message: "AI did not return any response. Please try again.",
      }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      },
    )
  }

  try {
    const parsed = safeParseJson(aiSchema)
    return EventFiltersSchema.parse(parsed)
  } catch (error) {
    console.error("Failed to parse AI response", error)
    throw new Response(
      JSON.stringify({
        message: "AI returned an invalid response. Please try again.",
      }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      },
    )
  }
}
