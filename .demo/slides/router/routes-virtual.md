---
theme: monomi
layout: default
---

# Routes definition - file-based

Inspired by Remix, manually reference files to build your own routes tree.

```ts
import { rootRoute, route, index, layout, physical } from "@tanstack/virtual-file-routes"

export const routes = rootRoute("root.tsx", [
  index("index.tsx"),
  layout("pathlessLayout.tsx", [
    route("/dashboard", "app/dashboard.tsx", [
      index("app/dashboard-index.tsx"),
      route("/invoices", "app/dashboard-invoices.tsx", [
        index("app/invoices-index.tsx"),
        route("$id", "app/invoice-detail.tsx"),
      ]),
    ]),
    physical("/posts", "posts"),
  ]),
])
```
