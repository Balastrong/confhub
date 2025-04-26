---
theme: monomi
layout: default
---

# Middlewares

```
const authMiddleware = createMiddleware().server( ... )
```

- Share logic before/after server functions
- Can edit/abort the request or pass data to the next middleware
- Can be chained together
