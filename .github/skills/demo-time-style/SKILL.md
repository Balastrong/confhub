---
name: demo-time-style
description: "Create or edit Demo Time plays for talks and live coding demos. Use for Demo Time JSON or YAML scenes, slides, short code demos, tiny highlights, cursor moves, VS Code tooltip hovers, suggest popups, snippet-based resets, and compact step sequences tuned for small editor windows."
argument-hint: "What Demo Time scene, act, or move do you want to script?"
---

# Demo Time Style

Create or refine Demo Time play files in the style used across this workspace.

This skill is for authoring tight, editor-first demos that reveal one idea at a time. It is not for large cinematic demo scripts with long setup sequences.

## When to Use

- Add a new Demo Time scene, demo, act, or move
- Convert a talk beat into a short Demo Time sequence
- Show a type tooltip, autocomplete popup, or small code change in VS Code
- Build a slide-to-code transition without cluttering the screen
- Refactor an existing Demo Time play to make it shorter and clearer
- Adapt a demo between schema v2 and schema v3 play files

## Workspace Patterns

This workspace uses one Demo Time play:

- `.demo/tanstack-start-demo.json`: schema version 3 with `scenes` and `moves`

Common structure and conventions:

- Slides live under `.demo/slides/`
- Reset or layout helpers can live under `.demo/snippets/`
- Code demos are editor-first, not terminal-first
- Titles are short and describe one visible beat
- Most code targets live in `src/routes/`, `src/components/`, or `src/services/`

## House Style

Follow these constraints unless the user explicitly asks for a different presentation rhythm.

- Keep most demos to `1-3` moves
- Treat `5` moves as a hard ceiling for a normal code beat
- Keep the visible code fragment very small because the screen shows about `18` lines max
- Each move should communicate one thing only
- Do not put two `highlight` moves in the same scene; split them into separate scenes, or use a single `open` move when the whole file is the point
- Prefer tiny highlights over broad ranges
- Prefer one short beat per title rather than one overloaded demo
- Keep setup moves separate from explanation moves when possible

The audience should always know exactly where to look.

## Preferred Move Patterns

### 1. Slide beat

Use this for a pure slide transition.

```json
{
  "action": "openSlide",
  "path": ".demo/slides/intro.md"
}
```

If you need to normalize layout first, prepend a reset snippet or view reset move.

### 2. Tiny code highlight

Use `highlight` to point at a single line or narrow token range.

```json
{
  "action": "highlight",
  "path": "src/routes/demo/search.tsx",
  "position": "19:33",
  "highlightWholeLine": true
}
```

Prefer this over opening a large selection or highlighting a full block.

### 3. Cursor-to-tooltip reveal

Use this when the point is type inference, route params, contextual types, or API hints.

```json
[
  {
    "action": "positionCursor",
    "path": "src/routes/demo/search.tsx",
    "position": "20,8"
  },
  {
    "action": "waitForTimeout",
    "timeout": 200
  },
  {
    "action": "executeVSCodeCommand",
    "command": "editor.action.showHover"
  }
]
```

Rules:

- Keep the cursor target precise
- Use a short wait only when needed for visual pacing
- Put a highlight before the cursor move if the audience needs a stronger focus cue

### 4. Cursor-to-suggest reveal

Use this when the point is autocomplete quality or path param safety.

```json
[
  {
    "action": "positionCursor",
    "path": "src/components/event/event-management-card.tsx",
    "position": "19,18",
    "highlightWholeLine": true
  },
  {
    "action": "waitForTimeout",
    "timeout": 2000
  },
  {
    "action": "executeVSCodeCommand",
    "command": "editor.action.triggerSuggest"
  }
]
```

Use this only when suggestions are the point. Do not add it as background flair.

### 5. Small live edit

Use `replace` with a snippet file when a code change must appear typed on screen.

```json
{
  "action": "replace",
  "path": "src/routes/hi.$name.$city.tsx",
  "startPlaceholder": "return <div>",
  "endPlaceholder": "",
  "contentPath": ".demo/snippets/file-param.txt",
  "insertTypingMode": "character-by-character",
  "insertTypingSpeed": 8
}
```

Rules:

- Keep inserted content short enough to stay readable in one beat
- Prefer placeholders for anchoring edits when the file may drift
- Use `character-by-character` for dramatic small edits
- Use `line-by-line` for slightly larger structural swaps

### 6. Browser or split-view proof

Use browser moves only when runtime behavior is part of the teaching point.

Typical pattern:

- `openWebsite`
- `splitEditorToRightGroup`
- focus back to code if needed

Do not open a browser for code-only points.

## Authoring Procedure

1. Inspect the target play file and confirm it uses schema v3 (`scenes` and `moves`).
2. Find the smallest audience-visible beat you need to show.
3. Pick the shortest move pattern that proves that point.
4. Keep the edited code region small enough to fit comfortably in the visible editor window.
5. Use placeholders for stable replacements and positions for precise cursor or highlight moves.
6. Add waits only when needed to make hover, suggest, or split-view transitions legible.
7. Re-read the sequence and remove any move that does not change what the audience learns.

## Decision Rules

Use this branching logic when writing or editing a demo.

- If the beat is a conceptual transition, use a slide move only
- If the beat is “look at this exact line”, use `highlight`
- If the beat is “see the inferred type or tooltip”, use `positionCursor` plus `showHover`
- If the beat is “see the IDE suggestions”, use `positionCursor` plus `triggerSuggest`
- If the beat is “watch the code change”, use `replace` with a snippet file
- If the beat is “see the result in the app”, add `openWebsite` and split view
- If the sequence needs more than five moves, split it into two scenes unless it is explicit setup

## Quality Checks

Before finalizing, verify all of the following.

- The title matches one clear beat
- The audience focus is obvious within one second
- The highlighted or edited region is as small as possible
- The move count is minimal
- The sequence fits the small-screen constraint
- The edit anchor is stable enough to survive nearby code changes
- Waits are purposeful, not decorative
- Browser setup appears only when the runtime proof matters

## Editing Existing Plays

When modifying an existing play:

- Preserve the file's existing schema version
- Preserve the surrounding title style and naming rhythm
- Reuse existing reset snippets and slide locations
- Avoid line-number-dependent edits when placeholders already exist or can be added safely
- Do not expand a concise demo into a long act unless the user explicitly asks for more narrative pacing

## Output Expectations

When using this skill to generate a Demo Time change, produce:

- The exact JSON or YAML block to add or replace
- Any required snippet or slide file references
- A short rationale tied to audience focus and move count
- Notes about schema version compatibility if relevant

## Notes Specific To This Workspace

- `.demo/tanstack-start-demo.json` is the canonical play file (schema v3, `scenes` and `moves`)
- In this workspace, concise beats are preferred over exhaustive scripting
