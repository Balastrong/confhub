---
theme: monomi
layout: section
---

# TanStack Start is "just a Vite plugin"

Router brings opinionated routing, Start injects server side capabilities

---
theme: monomi
layout: default
---

# Can a Vite plugin be a framework?

We have this _simple_ plugin that:

- Enforces an opinionated file based routing
    - Automatically generates boilerplate
- Provides a server side data fetching API
- Splits your app bundle into server and client
- Handles server side rendering

Nuxt and SvelteKit follow the same pattern

---
theme: monomi
layout: default
---

# Your Plug & Play Server

1. Build your awesome SPA with TanStack Router
2. Project grows and you now need some SSR Capabilities
3. `npm install @tanstack/react-start` and you're good to go! (kind of)
