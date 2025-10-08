---
theme: monomi
layout: section
---

# What about React Server Components?

---
layout: default
---

# RSCs in short

- Asynchronous React components that run once on the server
- Can fetch data, access databases, call APIs directly
- Returns serialized UI to the client with data baked in

<br />

```tsx
async function MyServerComponent() {
  const data = await sql`SELECT title FROM posts WHERE id = 1`
  return <div>{data.title}</div>
}
```

---
layout: default
---

# Just another way to fetch data in React

- They're prone to the same issues as other async/server data sources
  - Caching, staleness, deduplication, error handling, loading states
  - ...did anyone say "TanStack Query"?

---
layout: section
---

# RSC support in TanStack Start coming soon!

## ...as just another way of fetching data for a client-first app.
