---
theme: default
layout: section
---

# What about React Server Components?

Are they necessarily a paradigm shift?

---
layout: default
---

# RSCs in short

- Asynchronous React components that runs once on the server
- Can fetch data, access databases, call APIs directly
- Returns serialized UI to the client

---
layout: default
---

# Just another way to fetch data in React

- They return UI with data baked in
- They're prone to the same issues as other async/server data sources
  - Caching, staleness, deduplication, error handling, loading states
  - ...did anyone say "TanStack Query"?

---
layout: section
---

# RSC support in TanStack Start coming soon!

...as just another way of fetching data for a client-first app.
