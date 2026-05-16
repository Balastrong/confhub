---
name: slide-authoring
description: "Create or edit presentation slides under .demo/slides/. Use when writing new slides, trimming text, adjusting layouts, maintaining visual consistency, or adding card-based content. Covers the slide type catalogue, text limits, CSS component library, and rhythm rules."
argument-hint: "What slide do you want to create or edit?"
---

# Slide Authoring

Use this skill when creating, editing, or reviewing markdown slides under `.demo/slides/`.

## When to Use

- Create a new slide or slide group
- Edit the text, layout, or structure of an existing slide
- Review slide text density or visual consistency
- Add card grids, callouts, badges, or comparison layouts
- Check whether a slide fits the established style
- Decide between a section slide and a card slide

## Foundational Rules

These apply to every slide, regardless of type.

### Text Density

- **Maximum visible text per slide: 2–3 short sentences.** If you can't read it in 5 seconds, it's too long.
- Headings carry the message. Body text is supporting evidence, not a paragraph.
- Callouts get **one sentence**. If the callout needs two sentences, the slide needs splitting.
- Card bodies are **one line** (≤12 words). If a card body wraps to a second line, shorten it.
- Never use `###` on section slides. Section slides get `#` + optional `##` only.
- Code in cards uses `<code>` or backtick-rendered inline code — never multi-line code blocks.

### Frontmatter

Every slide file starts with frontmatter. The **first slide** in a file must include `theme: monomi`. Subsequent slides in the same file only need `layout`.

```yaml
---
theme: monomi
layout: section
---
```

Valid layouts: `intro` (cover only), `section`, `default`, `two-columns`.

### Slide Separators

Slides within a file are separated by `---` on its own line, followed by a frontmatter block:

```
---
layout: section
---
```

### Multi-Slide Files

Group slides in one file only when they form a unit that advances together (e.g., takeaway → next demo intro). Keep the group to 2–4 slides max. If you're writing 5+ slides, consider splitting into separate files.

## Slide Type Catalogue

### 1. Section Slide

The workhorse. Used for statements, transitions, emotional beats, takeaways, and demo intros.

```yaml
layout: section
```

**Format:**

```md
# Main statement

## Optional subtitle (one line)
```

**Rules:**

- Max two heading levels: `#` and `##`
- No body text, no HTML, no cards
- The heading IS the content — it should land in one glance
- Good for: opening statements, topic transitions, takeaways, pattern introductions

**Takeaway variant:**

```md
# Takeaway

## One clear sentence about what to remember
```

**Demo intro variant:**

```md
# Pattern Name

## One-line description of the pattern

<div class="badges">
  <span class="badge badge-blue">Library Name</span>
</div>
```

Use the badge to identify the inspiring library. Always use `badge-blue` for library names. Use `badge-green` for secondary labels (city, event, etc.).

### 2. Card Grid Slide

Used for structured content: feature lists, building blocks, comparisons, takeaway grids.

```yaml
layout: default
```

**Format:**

```md
# Short title

<div class="grid grid-auto">
  <div class="card card-sm">
    <div class="card-header">
      <div class="icon icon-blue">🔗</div>
      <h3>Card title</h3>
    </div>
    <p class="card-body">One short line</p>
  </div>
  <!-- more cards -->
</div>
```

**Rules:**

- Title: `#` heading, short (3–6 words)
- Max 6 small cards (`card-sm`) or 4 regular cards per slide
- Use `grid-auto` for 3+ small cards, `grid-2` for 2-column layouts, `grid-3` for 3-column
- Each card gets: one icon, one `<h3>` title, one `<p class="card-body">` line
- Optional callout below the grid (one sentence only)

### 3. Comparison Slide

A specialized card grid for ✅/❌ patterns.

```yaml
layout: default
```

**Format:**

```md
# Comparison title

<div class="grid grid-2">
  <div class="card">
    <div class="card-header">
      <div class="icon icon-red">❌</div>
      <h3>Bad approach</h3>
    </div>
    <p class="card-body"><code>bad code example</code></p>
  </div>
  <div class="card">
    <div class="card-header">
      <div class="icon icon-green">✅</div>
      <h3>Good approach</h3>
    </div>
    <p class="card-body"><code>good code example</code></p>
  </div>
</div>

<div class="callout callout-tip" style="margin-top:20px">
  <p style="margin:0;font-size:1em">One-sentence takeaway.</p>
</div>
```

**Rules:**

- Always `grid-2` for comparisons
- Left card = ❌ with `icon-red`, right card = ✅ with `icon-green`
- Card body: one `<code>` example or one short sentence, not both
- If you need both code and prose in a card, put code first, then a short `<p>` with `opacity:.7`

### 4. Cover Slide

Used exactly once, at the start.

```yaml
layout: intro
```

### 5. Bio / Two-Column Slide

Used exactly once, at the end.

```yaml
layout: two-columns
```

## CSS Component Reference

All components are defined in `.demo/slides/theme.css`. Use these classes — never write inline styles for things the theme already handles.

### Cards

- `.card` — standard glass card (padding 20px)
- `.card-sm` — compact card (padding 16px) — use for grids with 3+ cards
- `.card-accent` — blue-tinted highlight card
- `.card-header` — flex row with icon + title
- `.card-body` — body text (0.95em)

### Icons

- `.icon` — 36×36 rounded square with emoji
- `.icon-lg` — 40×40 variant for numbered cards
- Colors: `.icon-blue`, `.icon-green`, `.icon-yellow`, `.icon-red`, `.icon-purple`, `.icon-indigo`

### Grids

- `.grid` — base grid container (always add a column class)
- `.grid-2` — two equal columns
- `.grid-3` — three equal columns
- `.grid-auto` — auto-fit responsive columns (best for 3–6 small cards)
- `.span-full` — make a card span the full grid width

### Badges

- `.badges` — inline-flex container for badge groups
- `.badge` — pill-shaped label
- `.badge-blue` — blue tint (libraries, tools)
- `.badge-green` — green tint (events, locations)

### Callouts

- `.callout` — base callout box
- `.callout-tip` — green-to-blue gradient (takeaways, rules)
- `.callout-info` — indigo-to-blue gradient (context, background)
- `.callout-warn` — yellow-to-red gradient (warnings, pitfalls)

### Dot Lists

- `.dot-list` > `.dot-item` > `.dot` + text
- Dot colors: `.dot-green`, `.dot-red`, `.dot-blue`

### Utilities

- `.centered` — full-height centered flex column
- `.step-num` — 40×40 numbered square for step indicators
- `.inline-code` — styled inline code span (use inside cards when `<code>` needs extra styling)

### Gradient Text

Use on `<span>` elements to colour a single keyword or short phrase. In this deck, colour is partly semantic and partly brand-driven:

- `.grad-blue` — **TanStack Start** and Start-adjacent ideas: client-first, server capabilities, Start branding, plus type-safety/inference when that is the point (`#60a5fa → #818cf8`)
- `.grad-green` — **TanStack Router**, routing concepts, positive outcomes, adoption confidence, "yes", simple, inferred (`#34d399 → #10b981`)
- `.grad-orange` — framework/server/platform concepts and generic emphasis: SSR, isomorphic, HTTP endpoints, "internet", migration, early-adopter framing (`#fbbf24 → #f97316`)
- `.grad-purple` — abstractions, architecture, shared state, dependency injection, conceptual framing (`#c084fc → #818cf8`)
- `.grad-lime` — open source, enabled, live, coming soon (`#a3e635 → #34d399`)
- `.grad-yellow` — JavaScript or explicit/manual concepts (`#eab308 → #d97706`)
- `.grad-red` — warnings, danger, security-first moments (`#f87171 → #ef4444`)
- `.grad-indigo` — available, but use sparingly; avoid defaulting to it when blue already carries the main product identity (`#a5b4fc → #6366f1`)

```html
<span class="grad-blue">inference</span>
<span class="grad-yellow">JavaScript</span>
<!-- italic is fine via inline style or <i> -->
<span class="grad-green" style="font-style:italic">open</span>
```

**Rules:**

- All three gradient properties (`background`, `-webkit-background-clip`, `-webkit-text-fill-color`) must live in the **same CSS rule** — splitting them into a shared selector + individual rule breaks `background-clip` in some renderers
- Use gradients on **message-bearing words only**, not as decoration for every noun
- Prefer **1–2 highlights per slide**. `3` is acceptable on anchor slides where the contrast is the point; avoid going beyond that
- In ConfHub specifically, preserve the product mapping: **Start = blue**, **Router = green**
- If a slide already has strong blue branding, reach for **orange** or **purple** for generic emphasis before adding more blue
- The cover `<h1>` uses a unique 3-stop inline gradient — that is the only allowed inline gradient

## Inline Style Exceptions

Prefer theme classes. Use inline styles only for:

- `margin-top` adjustments between components (e.g., `style="margin-top:16px"`)
- `opacity` on secondary text (e.g., `style="opacity:.7"`)
- `font-style:italic` on gradient `<span>` elements
- `font-size` overrides on the intro slide title
- The cover `<h1>` multi-stop title gradient (one-off, not reused)

Never use inline styles for colors, padding, borders, or layout — those belong in theme.css.

## Rhythm & Flow

### Section ↔ Card Alternation

The talk alternates between section slides (fast, emotional) and card slides (structured, visual). A good rhythm:

```
section → section → card → section (takeaway) → demo code → section (intro) → ...
```

- Never put two card slides back-to-back without a section slide between them
- Section slides are fast — the speaker advances through 2–3 in quick succession
- Card slides are where the audience pauses to read — one per teaching point

### Grouped Slides

When a slide file contains multiple slides (e.g., takeaway + next demo intro):

1. Start with the takeaway (section layout)
2. End with the next intro (section layout with badge)
3. If there's a structural card between them (e.g., the "arc" explanation), it goes in the middle

### Callout Frequency

- Max **one callout per slide**
- Not every card slide needs a callout — use only when there's a clear one-line takeaway
- Callout types map to intent: `callout-tip` for advice, `callout-info` for context, `callout-warn` for danger

## Checklist

Before finishing a slide edit, verify:

- [ ] Every slide has an explicit `layout` in its frontmatter
- [ ] First slide in file has `theme: monomi`
- [ ] No slide has more than ~3 sentences of visible text
- [ ] Section slides use only `#` and `##` — no `###` or body text
- [ ] Card bodies are one line each
- [ ] Callouts are one sentence each
- [ ] Comparison slides use `grid-2` with ❌/✅ icons
- [ ] Demo intros use pattern name (not "DEMO 0N") + badge for library
- [ ] No inline styles for things the theme already provides
- [ ] Slide groups within one file are ≤4 slides

## Tips

- **When in doubt, split.** A slide with too much content is always better as two lean slides.
- **Headings are speaker cues.** Write them the way you'd say them out loud — short, punchy, conversational.
- **Cards are for scanning, not reading.** If the audience needs to read a card body carefully to understand it, the card title isn't doing its job.
- **Callouts are punchlines.** They should land after the cards set up the context — never repeat what the heading already says.
- **Badges replace labels.** Anywhere you'd write a small uppercase label (library name, event name), use a badge instead of inline styling.
- **Tables are OK for recaps.** A pattern-recap table at the end of a section is good — it's scannable and acts as a visual anchor. Keep columns to 2–3.
- **Gradient text is for the closing quote only.** Don't overuse the gradient text effect — it's reserved for the emotional peak near the end.
- **Gradient text is allowed across the deck, but sparingly.** Use it to land the claim of the slide, not to decorate repeated terminology.
- **Brand colours beat generic semantics.** In this deck, if the word refers to Start or Router, keep the product colour first and only then consider the generic semantic meaning.
