---
theme: default
layout: section
---

# Server Functions

A simple function call within the server, fetchable from the client

---
layout: default
---

# A Server Function

- Runs only on the server (code does not reach the client bundle)
- Can be called from the client or server seamlessly
  - Server: A simple async function
  - Client: An HTTP endpoint hit with a fetch

```ts
// Client or server, doesn't matter
const response = await getSomethingFromServer()
```