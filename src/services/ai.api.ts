import { createServerFn, json } from "@tanstack/react-start"
import z from "zod"
import { EventFiltersSchema } from "./event.schema"
import { userRequiredMiddleware } from "./auth.api"
import { createRateLimitMiddleware } from "./rate-limit.middleware"
import OpenAI from "openai"
import { getTags } from "./tags.api"
import { getCountries } from "./countries.api"

const token = process.env.LLM_TOKEN!
const endpoint = process.env.LLM_ENDPOINT!
const model = process.env.LLM_MODEL!

export const generateFiltersSchema = createServerFn({ method: "POST" })
  .validator(z.string())
  .middleware([
    userRequiredMiddleware,
    createRateLimitMiddleware({
      key: ({ userId }) => `ai:generateFiltersSchema:${userId}`,
      windows: [
        { name: "min", limit: 5, windowSec: 60 },
        { name: "day", limit: 15, windowSec: 60 * 60 * 24 },
      ],
    }),
  ])
  .handler(async ({ data }) => {
    const client = new OpenAI({ baseURL: endpoint, apiKey: token })

    const tags = await getTags()
    const countries = await getCountries()

    const systemPrompt = [
      "Extract event filters and return JSON only.",
      "Allowed keys ONLY: tags, modes, country, hasCfpOpen, startDate.",
      "Omit any key that isn't clearly needed by the user prompt. Do not guess values, EXCEPT tags may be derived from clear hints.",
      "tags: up to 3; derive from explicit mentions or clear hints; map to closest in valid tags; lowercase; strip '#'; dedupe; if no match, omit.",
      "modes: include ONLY if explicitly mentioned; allowed: 'in-person', 'hybrid', 'online'.",
      "country: include ONLY if explicitly named; must be one of valid countries; do not infer from cities/regions.",
      "hasCfpOpen: include ONLY if CFP status is mentioned by the user; true for open/accepting; false for closed.",
      "startDate: include ONLY if the user mentioned it; format YYYY-MM-DD;",
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
        { role: "user", content: data },
      ],
      temperature: 0,
      top_p: 0,
      model,
      response_format: { type: "json_object" },
    })

    const aiSchema = response.choices[0].message.content?.trim()

    console.log(aiSchema)

    if (!aiSchema) {
      throw json(
        { message: "AI did not return any response. Please try again." },
        { status: 500 },
      )
    }

    try {
      const parsed = safeParseJson(aiSchema)
      return EventFiltersSchema.parse(parsed)
    } catch (e) {
      console.error("Failed to parse AI response", e)
      throw json(
        { message: "AI returned an invalid response. Please try again." },
        { status: 500 },
      )
    }
  })

// Attempts to robustly extract a valid JSON object from a model response.
// Handles common failure cases: code fences, leading/trailing prose, and extra text.
function safeParseJson(text: string): any {
  // 0) Strip any <think>...</think> blocks or leading content ending with </think>
  if (text.toLowerCase().includes("</think>")) {
    // Remove well-formed <think>...</think> sections
    text = text.replace(/<think[\s\S]*?<\/think>/gi, "")
    // If a stray closing tag remains, keep only what follows the last one
    const lower = text.toLowerCase()
    const lastClose = lower.lastIndexOf("</think>")
    if (lastClose !== -1) {
      text = text.slice(lastClose + "</think>".length)
    }
  }
  // 1) Strip common markdown code fences
  let t = text.trim()
  if (t.startsWith("```")) {
    // remove first fence line
    t = t.replace(/^```(?:json)?\s*/i, "")
    // remove trailing fence
    t = t.replace(/\s*```\s*$/i, "")
    t = t.trim()
  }

  // 2) Try direct parse
  try {
    return JSON.parse(t)
  } catch (_) {
    // 3) Try to extract the first balanced JSON object
    const extracted = extractFirstJsonObject(text)
    if (extracted) {
      return JSON.parse(extracted)
    }
    // Re-throw with original error by parsing again to surface message
    return JSON.parse(t)
  }
}

function extractFirstJsonObject(input: string): string | null {
  const s = input
  const start = s.indexOf("{")
  if (start === -1) return null
  let depth = 0
  for (let i = start; i < s.length; i++) {
    const ch = s[i]
    if (ch === "{") depth++
    else if (ch === "}") {
      depth--
      if (depth === 0) {
        return s.slice(start, i + 1)
      }
    }
  }
  return null
}
