---
theme: monomi
layout: default
---

# Builder Pattern?

```
createServerFn().middleware().validator().handler()
```

For the devs:
- Displays nicely the execution order
- Enforces the order with Typescript

For the maintainers:
- Easier to propagate the types
- Easier from the vite plugin to extract the functions
