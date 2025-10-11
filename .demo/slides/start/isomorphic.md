---
theme: monomi
layout: section
---

# Everything is isomorphic by default

---
layout: default
---

# What does isomorphic mean here?

- Your code can run on **both** server and client
- You can choose to run code **only** on server or client
- You can define **different behaviors** for server and client

<br />

```tsx
export const Route = createFileRoute("/items")({
  ssr: true, // Default true, can also be false or 'data-only'
  loader: () => {
    // ✅ This can run on BOTH server and client
  },
  component: RouteComponent,
})
```
