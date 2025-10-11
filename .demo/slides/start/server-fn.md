---
theme: monomi
layout: section
---

# How can I run code on the server, but call it from the client?

## ...isn't that just a fetch?

---
layout: section
---

# Server Functions

## The code remains only in the server bundle, but the client can call it

---
layout: default
---

# A Server Function

- Runs only on the server
  - The code is not included in client bundle
  - Creates an HTTP endpoint
- Can be called from the client or server seamlessly
  - Server: Runs the function directly
  - Client: Makes a fetch request to the generated endpoint

The safest way to manage secrets, database connections, etc.

<br />

```ts
// Client or server, it always works
const response = await getData()
```