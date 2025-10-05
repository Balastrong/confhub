---
layout: section
---

# What happens now? Isomorphic by default

---
layout: default
---

# What does isomorphic mean here?

- By default, your code can run on both server and client
- You can choose to run code only on server or client
- You can define different behaviors for server and client

<br />

```ts
// ✅ This runs on BOTH server and client
function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}
```
