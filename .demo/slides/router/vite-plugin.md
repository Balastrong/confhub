---
theme: monomi
layout: default
---

# Vite Plugin

Manually configured on Router, automatically set on Start.

```ts
// vite.config.ts
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { TanStackRouterVite } from "@tanstack/router-plugin/vite"

export default defineConfig({
  plugins: [TanStackRouterVite(), react()],
})
```
