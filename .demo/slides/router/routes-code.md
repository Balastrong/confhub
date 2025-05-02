---
theme: monomi
layout: default
---

# Routes definition: code-based

Manually handle and maintain routes in your code

```ts
import { createRootRoute, createRoute } from "@tanstack/react-router"

const rootRoute = createRootRoute()

const postsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "posts",
})

const postRoute = createRoute({
  getParentRoute: () => postsRoute,
  path: "$postId",
})
```
