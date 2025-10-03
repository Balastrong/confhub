---
theme: default
layout: default
---

# At some point you might need...

- Full-document SSR
- Streaming
- Server Routes & API Routes
- Server Functions
- Middleware & Context
- Full-Stack Bundling
- Universal Deployment
- End-to-End Type Safety

---
layout: default
---

<img src=".demo/slides/img/start.png" alt="TanStack Start" style="width: 100%; height: auto; object-fit: contain;" />

---
layout: default
---

# Migration is simple

1. Swap the vite plugin
2. Move the router in a `router.tsx` file
3. Do a couple changes in `__root.tsx`

```diff
// vite.config.ts
+import { tanstackStart } from '@tanstack/react-start/plugin/vite'
-import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
+    tanstackStart(),
-    TanStackRouterVite()
  ],
})
```

---
layout: section
---

# ...a full-stack framework literally inside a vite plugin

---
layout: section
---

# What happens now? Isomorphic by default

---
layout: default
---

# What does isomorphic mean here?

- By default, your code runs on both server and client
- You can choose to run code only on server or client
- You can define different behaviors for server and client
