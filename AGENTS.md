# Talk Constitution — "TanStack Start: a fresh take on React full-stack applications"

## Core Message

This talk introduces TanStack Start as a fresh take on full-stack React applications: client-first, Vite-powered, and built around colocated server and client code instead of heavy framework ceremony. The goal is to show that you can get server-side rendering, server logic, and production-ready full-stack workflows without adopting confusing APIs or awkward mental models.

Every beat should make that promise visible in the editor or browser: routing stays typesafe, search and context feel natural, server logic sits close to the UI that uses it, and Start expands the SPA model instead of replacing it with something alien.

## Guiding Principles

- **Show the workflow value first.** The audience should see how TanStack Start improves day-to-day full-stack React development before hearing about implementation details.
- **Keep the client-first promise visible.** Colocated server code, SSR, and server features should feel like a natural extension of app code, not a separate world.
- **Use types as proof, not decoration.** Hovers, suggestions, and validated APIs should confirm behavior the audience already cares about.
- **Progress from Router to Start.** Move from routing fundamentals into full-stack capabilities so the narrative feels like a widening of the same model.

## Tone

- Conversational and direct. Explain what the feature buys you in real app work.
- Product-minded, not academic. Frame each beat as a workflow improvement, not as a type-system flex.
- Keep claims grounded. Avoid hype unless the demo on screen clearly earns it.
- When comparing with other frameworks, focus on API clarity and developer experience rather than taking cheap shots.

## Presentation Tooling

The presentation is built with **[Demo Time](https://marketplace.visualstudio.com/items?itemName=eliostruyf.vscode-demo-time)** (`eliostruyf.vscode-demo-time`), a VS Code extension that scripts coding demos and presents slides directly inside the editor. Docs: [demotime.show](https://demotime.show/).

Key concepts:
- **Play** → the full `.demo` folder. **Act** → a single `*.yml` or `*.json` file per topic. **Scene** → one beat in the talk. **Move** → one atomic action inside a scene.
- Supported actions include `open`, `highlight`, `replace`, `snippet`, `openSlide`, browser actions, terminal actions, and arbitrary VS Code commands.
- Slides are presented inside VS Code, and most code beats are editor-first with small, focused highlights.

## Canonical Workflow

- `.demo/tanstack-start-demo.json` is the source of truth for the live talk.
- Start there to understand the current sequence, scene titles, descriptions, and referenced files.
- Follow the `moves[].path` entries to the actual live assets under `.demo/slides/`, `src/routes/`, `src/components/`, `src/hooks/`, and `src/services/`.
- When changing talk flow, keep `.demo/tanstack-start-demo.json` and the referenced files in sync.

## Demo Structure

The current talk is organized around two broad themes:

- **Router fundamentals**: typed path params, typesafe links, validated search state, route context, and loader behavior.
- **Start capabilities**: isomorphic code, server functions, middleware, server routes, deployment, and broader full-stack features shown inside the ConfHub app.

When editing or extending the talk, preserve that progression from routing primitives to the broader claim in the abstract: full-stack React with SSR and server logic, while keeping the feel and benefits of a single-page application.

## Reference Material

- The live assets that matter are the ones referenced from `.demo/tanstack-start-demo.json`.
- Slides live under `.demo/slides/`, with topic groupings such as `.demo/slides/router/` and `.demo/slides/start/`.
- Supporting snippets live under `.demo/snippets/`.
- The main demo targets are in the app source tree, especially `src/routes/`, `src/components/`, `src/hooks/`, and `src/services/`.
- Treat anything not referenced by `.demo/tanstack-start-demo.json` as secondary unless the user explicitly asks to revive or reuse it.

Use `AGENTS.md` as the always-on brief. For live talk work, inspect `.demo/tanstack-start-demo.json` first and treat other imported or historical material as non-authoritative unless the user explicitly says otherwise.
