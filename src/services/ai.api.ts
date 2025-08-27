import { createServerFn, json } from "@tanstack/react-start"
import z from "zod"
import { EventFiltersSchema } from "./event.schema"
import { userRequiredMiddleware } from "./auth.api"
import { createRateLimitMiddleware } from "./rate-limit.middleware"
import OpenAI from "openai"
import { getTags } from "./tags.api"
import { getCountries } from "./countries.api"

const { token, endpoint, model } = (() => {
  if (process.env.NODE_ENV === "development") {
    return {
      token: "ollama",
      endpoint: "http://localhost:11434/v1",
      model: "llama3.2:latest",
    }
  } else {
    return {
      token: process.env.GITHUB_TOKEN!,
      endpoint: "https://models.github.ai/inference",
      model: "openai/gpt-4.1-nano",
    }
  }
})()
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

    const systemPrompt = `You are an information extractor. Convert a user's request into a STRICT JSON object of filters.

OUTPUT CONTRACT (no deviations):
- Output ONLY a single minified JSON object; no markdown, no code fences, no explanations.
- Include ONLY these keys when relevant: tags, modes, country, hasCfpOpen, startDate.
- Omit any key that is not explicitly supported or not mentioned by the user.
- Never output null, undefined, empty arrays, comments, or trailing commas.
- Dates MUST be ISO-8601 (YYYY-MM-DD) and represent the earliest concrete date implied by the user. If no date is implied, omit startDate.

TARGET SHAPE (Zod-style, all keys optional):
z.object({
  tags: z.array(z.string()), // Allowed values (case-insensitive, match by exact name): ${tags.join(", ")}
  modes: z.array(z.enum(["in-person", "hybrid", "online"])),
  country: z.string(), // Only if the user explicitly names a country in this list: ${countries.join(", ")}
  hasCfpOpen: z.boolean(),
  startDate: z.string().date().nullish(),
}).partial()

STRICT RULES:
- Do not invent information. Use only what the user stated or clearly implied.
- Tags: select at most 1-3 of the most specific tags explicitly mentioned or clearly synonymous; if none apply, omit tags.
- Modes: INCLUDE ONLY IF THE USER EXPLICITLY SPECIFIES IT. Never infer from topics or tags (e.g., "Android", "React" do NOT imply any mode). Map synonyms: "online/virtual/remote" -> "online"; "in person/in-person/physical" -> "in-person"; "both" -> "hybrid". If the user does not use such words, omit modes.
- Country: include only if the user clearly specifies a single country from the allowed list; otherwise omit.
- hasCfpOpen: true only if the user asks for open CFPs or similar (e.g., "accepting talks", "CFP open"). Otherwise omit.
- If the request is unrelated or too vague, return {}.
- Today is ${new Date().toISOString()} for resolving relative dates like "this week" or "next month"; compute a concrete earliest date (YYYY-MM-DD) or omit if unclear.

EXAMPLES (input -> exact output):
1) "Show me online React events in Italy"
-> {"tags":["react"],"modes":["online"],"country":"Italy"}

2) "in-person javascript or typescript meetups in the US starting next week"
-> {"tags":["javascript","typescript"],"modes":["in-person"],"country":"United States","startDate":"<computed YYYY-MM-DD for next week>"}

3) "Any conferences"
-> {}

4) "Hybrid AI/ML events with CFP accepting"
-> {"tags":["ai","machine learning"],"modes":["hybrid"],"hasCfpOpen":true}

5) "Show me React events in Italy"
-> {"tags":["react"],"country":"Italy"}

6) "Show me React events"
-> {"tags":["react"]}

7) "Android events"
-> {"tags":["android"]}

8) "Android online events"
-> {"tags":["android"],"modes":["online"]}

Do not copy example outputs unless the user query matches. Apply the rules.

Most importantly: do NOT add modes unless the user explicitly specifies them.

Now, given the user request, output ONLY the JSON object with the applicable keys and values. No prose.`

    const response = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        { role: "user", content: data },
      ],
      temperature: 0,
      top_p: 1.0,
      model,
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
