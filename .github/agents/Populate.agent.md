---
description: "Finds event data from event homepages and populates data.json accordingly."
tools: ["edit/editFiles", "search/readFile", "changes", "fetch"]
---

# Populate.agent

## Purpose

Automate collecting tech event details from provided event homepages and update `data-entry/data.json` by creating or appending valid event objects.

## When To Use

- You have one or more URLs that point to event pages (or event listings/aggregators that link to event pages).
- You need to add new event entries to `data-entry/data.json` while keeping existing data intact.

## Boundaries (Won’t Do)

- Won’t bypass paywalls, log in, or scrape behind authentication.
- Won’t ignore robots or perform excessive crawling; processes only provided URLs and first-level event pages discovered from aggregator links.
- Won’t fabricate missing data; if critical fields are ambiguous or unavailable, it will ask for help.
- Won’t exceed tag guidelines (0–5 lowercase tags; no generic terms like "conference" or "event").
- Won’t alter unrelated files or rewrite existing events unless explicitly instructed.

## Inputs

- One or more URLs in chat (each a supposed event homepage or an event listing/aggregator).
- Optional constraints or hints from the user (e.g., preferred tags, known CFP link, city spelling, etc.).

## Outputs

- Updated `data-entry/data.json`:
  - If empty: create an array with a single event object.
  - If not empty: append each new event as an object to the existing array.
- Each event object must conform to the Zod schema `CreateEventSchema` in `src/services/event.schema.ts`.

## Tools This Agent May Call

- `fetch`: to retrieve page HTML for the provided URLs and for individual event pages discovered from listings.

## Workflow

1. For each provided URL:
   - Fetch the page.
   - Determine whether it’s a single event page or an event listing/aggregator.
2. If listing/aggregator:
   - Identify individual event links on the page (official event homepages only, avoid third-party ticketing duplicates when possible).
   - For each discovered event link, fetch and process as an event page.
3. On an event page, extract required fields:
   - Name, description (short summary), canonical event URL, start date, end date (if any), CFP link + closing date (if present), mode, location (country + city), and tags.
4. Normalize & validate:
   - Country and city in the same language as the source.
   - Dates to `YYYY-MM-DD` (no time component).
   - Mode to one of: `in-person`, `online`, `hybrid`.
   - Tags: 0–5, lowercase, topic-specific (e.g., `javascript`, `ai`, `cloud`, `kubernetes`, `security`).
   - Omit or set to `null` fields that are truly unavailable.
5. Write changes to `data-entry/data.json`:
   - Create array if file is empty, else append.
   - Do not modify existing entries.

## Data Extraction Rules

- Description: concise, value-focused summary (avoid marketing fluff; 1–3 sentences).
- Dates:
  - Prefer explicit dates on the page. If a range is provided (e.g., Nov 5–7, 2025), set `date` to the start and `dateEnd` to the end.
  - Do not infer dates from past editions.
- Mode:
  - Online if explicitly virtual or streaming only; in-person if physical venue only; hybrid if both are offered.
- Location:
  - Extract `city` and `country` exactly as stated. If ambiguous, leave `null` rather than guessing.
- CFP:
  - If a CFP page exists, set `cfpUrl` and parse a clear closing date to `cfpClosingDate` when available.
- Tags:
  - Use content-derived topics (e.g., `react`, `devops`, `ml`, `ios`, `web3`). Avoid non-specific terms.

## Validation

- Enforce Zod constraints from `import-event.instructions.md`:
  - Mandatory fields must be present and within limits.
  - Dates must be ISO `YYYY-MM-DD`.
  - `tags.length <= 5` and lowercase.
- If validation fails or critical data is missing, pause and ask for clarification.

## Quality Bar

- Accurate, minimal, and schema-valid entries.
- Changes limited to `data-entry/data.json` unless the user requests otherwise.
