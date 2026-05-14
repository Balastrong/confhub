---
name: demo-index-sync
description: "Create or edit talk slides and Demo Time beats in this workspace. Use when working on .demo/tanstack-start-demo.json, markdown slides, demo code files, talk flow, or keeping the demo index, slides, and code in sync."
argument-hint: "What slide, demo beat, or talk-flow change do you want to make?"
---

# Demo Index Sync

Use this skill when editing the talk structure, slides, or demo files in this workspace.

The core rule is simple: `.demo/tanstack-start-demo.json` is the canonical index for the talk. It is the fastest way to recover context, find the files involved in a beat, and understand the presentation flow.

## When to Use

- Add, remove, rename, or reorder a talk beat
- Edit a slide under `.demo/slides/`
- Edit demo code that is opened from `.demo/tanstack-start-demo.json`
- Check whether a slide or code file is still referenced
- Clean up stale slides or demo files after changing the talk flow
- Gather context for a section of the talk before making changes

## Canonical Source Of Context

Treat `.demo/tanstack-start-demo.json` as the first file to inspect for slide and demo work.

Use it to answer these questions before editing:

- What is the current talk order?
- Which slide or code file is used for this beat?
- What comes immediately before and after this beat?
- Is the target file still part of the talk, or already orphaned?

Do not navigate the talk by guessing from filenames alone when the index can answer it directly.

## Procedure

1. Open `.demo/tanstack-start-demo.json` first.
2. Find the relevant scene entry and inspect its `title`, `description`, and `moves`.
3. Follow the `path` fields in the referenced moves to gather the real context from slides or code.
4. Inspect adjacent entries in the index so you understand the local narrative flow, not just the isolated file.
5. Make the smallest coherent change across index, slide files, and code files.
6. Verify there are no stale references left behind.

## Sync Rules

Changes to slides or demos are not complete until the index and referenced files agree.

### If You Add A Beat

- Add the new entry in `.demo/tanstack-start-demo.json`
- Create the referenced slide or code file if it does not already exist
- Place it in the correct narrative position relative to neighboring beats

### If You Rename Or Move A Beat

- Update the relevant entry in `.demo/tanstack-start-demo.json`
- Update every affected `path`
- Rename or move the referenced file so the index still points to a real target
- Re-check adjacent beats in case the title or description should change with the new flow

### If You Remove A Beat

- Remove the entry from `.demo/tanstack-start-demo.json`
- Delete the referenced slide file if it is no longer used anywhere else
- Keep unreferenced code files by default unless the user explicitly wants cleanup or the file is clearly dead
- If the file is shared by multiple beats, keep the file and remove only the stale reference

### If You Edit A Referenced File

- Confirm the file is still referenced by `.demo/tanstack-start-demo.json`
- If the edit changes the teaching purpose, also update the entry title or description when needed
- If the edit splits one beat into two, reflect that in the index instead of hiding the structural change in the file alone

### If You Reorder Or Renumber Beats

- Update neighboring titles or numbering so the local sequence still reads cleanly
- Re-check surrounding descriptions when a beat changes role because of its new position
- Do not leave old numbering in titles after moving or removing entries

## Decision Rules

- If the requested change is about talk structure, start from neighboring entries in `.demo/tanstack-start-demo.json`
- If the requested change is inside one slide or demo file, still inspect the matching index entry before editing
- If a file exists under `.demo/slides/` or `.demo/code/` but is not referenced by the index, treat it as suspicious and verify whether it should be deleted or reintroduced
- If a beat is removed from the index, do not leave the old slide behind unless it is intentionally parked for later reuse

## Completion Checks

Before finishing, verify all of the following.

- `.demo/tanstack-start-demo.json` reflects the intended talk flow
- Every edited or added `path` in the index points to a real file
- Removed beats do not leave accidental orphan slide files behind
- Unreferenced code files are either intentionally kept or explicitly cleaned up
- Slide text, demo code, and index descriptions still describe the same teaching point
- Neighboring beat titles and numbering still make sense after reorder or removal
- Pattern demo files still follow the workspace demo-file conventions when applicable

## Output Expectations

When using this skill, the result should usually include:

- The required file edits
- Any matching index updates in `.demo/tanstack-start-demo.json`
- Any file deletions needed to keep the talk assets clean
- A short note about what changed in the local talk flow
