---
theme: default
layout: section
---

# SSR with the benefits of SPA

---
layout: default
---

# Server Side Rendering in TanStack Start

- By default, is performed only on the first load
  - SEO friendly
- All other navigations are client-side
  - Fast and smooth as in a SPA

_There are options to customize this behavior_


---
layout: default
---

# SSR Example

```tsx
export const Route = createFileRoute('/products')({
  ssr: true, // Default true, can also be false or 'data-only'
  loader: async () => {
    // This runs on server during SSR (first navigation)
    // Will run on client during client-side navigations
    const response = await fetch('/api/products')
    return response.json()
  },
})
```