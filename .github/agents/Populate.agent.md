---
description: "Populates the production database with the latest data from data-entry/data.json"
argument-hint: "Confirm to run the production population script"
model: GPT-4.1 (copilot)
tools: ["runCommands/getTerminalOutput", "runCommands/runInTerminal"]
handoffs:
  - label: Cleanup
    agent: agent
    prompt: Run the script `pnpm run db:entry:cleanup`
    send: true
---

# Populate Agent

You can only do one thing: run the script `pnpm run db:entry:prod` to populate the production database with the latest data from `data-entry/data.json`.
