# Current Demo Coverage

Based on the current order in `.demo/tanstack-start-demo.json`.

1. Framing the talk: why TanStack Start exists, and the client-first vs server-first positioning.
2. Router fundamentals kickoff: typed path params with a live route example.
3. Type inference proof: hover-driven type safety for route params.
11. (DONE) File-based routing: naming conventions, generated behavior, and what the filesystem model unlocks.
4. Typesafe navigation: links enforce required params and guide autocomplete.
5. Search state management: moving filters from local React state into validated router search params.
6. (NEW?) Advanced search params: custom serialization, stripping defaults, and making URL state cleaner without losing type safety.
7. Route context: passing typed context from the root route into child routes.
8. Data loading: loaders, typed loader results, caching with `staleTime`, and route preloading.
9. (DONE) TanStack Query integration: query prefetching and cache hydration with loaders and server functions. TODO: Add a demo?
10. (NEW?) Navigation blocking: guarding route transitions when local form state is dirty.
12. Router recap: TanStack Router already covers a large part of app architecture.
13. Start expansion: TanStack Start adds server capabilities on top of the router model.
14. SSR: full-document server rendering as an opt-in extension of the same app model.
15. (NEW?) Streaming SSR: make the server-rendering story concrete with partial rendering and progressive reveal.
16. Isomorphic code: shared logic that works cleanly across client and server boundaries.
17. (DONE) Import protection: `.server.ts` modules make server-only boundaries explicit and catch accidental client imports.
18. Server functions: colocated backend logic with end-to-end type safety.
19. Middleware: reusable auth and request pipeline composition for server functions.
20. Server routes: exposing public endpoints from the same codebase.
21. Deployment story: Vite-powered adapters and portable deployment options.
22. Real app validation: ConfHub as the production-style example.
23. Extra full-stack demos: query preloading, dynamic SEO, protected routes, AI instructions, LLM integration, and MCP server support.
24. Future-facing topic: React Server Components.
25. (NEW) RSC live example: go beyond the slide with a minimal server-components example that feels concrete, not speculative.
26. Adoption and migration: how to get started and how incremental the move can be.
27. Builder workflow: scaffolding a new app with `create-tsrouter-app` and previewing the result.
28. Closing.

## Remaining Proposal Backlog

Based on the latest TanStack Router and TanStack Start docs, plus recent public release notes.

1. Route masking: show modal or detail navigation that preserves a clean background location.
2. Deferred data loading: demonstrate a fast shell with slower data revealed later.
3. Document head management: show typed route-level title and meta handling directly in the router layer.
4. Scroll restoration: show route-aware scroll recovery instead of manual effect-based logic.
5. Not-found and authenticated route flows: useful for showing real app behavior, not just happy paths.
6. Devtools or router events: a short DX beat could make the internal router model more visible.
7. Automatic code splitting or view transitions: both are strong for showing polish and runtime UX.
8. Selective SSR and SPA mode: useful to prove Start can mix rendering strategies instead of forcing one model everywhere.
9. Static prerendering and ISR: good additions if the audience cares about content-heavy or cache-friendly pages.
10. Static server functions: worth showing if you want a cleaner story around build-time or cacheable server work.
11. Authentication and database patterns: this could turn the current middleware and server-function section into a more complete full-stack workflow.
12. Observability: a short demo of server visibility or tracing would strengthen the production-readiness angle.
13. SEO and LLM optimization: the docs now treat these as first-class concerns, so they could fit well after the dynamic SEO beat.
14. Early Hints support: recent release notes mention this, and it fits the performance and deployment part of the story well.
15. Link header support: also recently highlighted, and it could pair nicely with preloading and delivery optimization.