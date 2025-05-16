---
theme: monomi
layout: section
---

# React is going on the Server

## Nextjs, Server Components, useActionState/useTransition

---
theme: monomi
layout: default
---

# SSR tecniques bring a lot of benefits

- Improved Initial Load Performance
- Enhanced SEO Capabilities
- Reduced Client-Side JavaScript

---
theme: monomi
layout: default
---

# Rendering on the client still makes sense

- Easier to handle highly interactive applications
- Totally fine for applications behind a login
- Smooth user experience and navigation
- Cheaper hosting

---
theme: monomi
layout: section
---

# The right tool for the job

## Where is TanStack Start positioned

---
theme: monomi
layout: image
image: .demo/assets/start.png
---

---
theme: monomi
layout: default
---

# TanStack Start is just the tip of the iceberg

<img src=".demo/assets/iceberg.png" alt="Iceberg" style="margin: auto; margin-top: 10px; height: 80%"/>

---
theme: monomi
layout: default
---

# TanStack Start is just the tip of the iceberg

<img src=".demo/assets/iceberg-flip.png" alt="Iceberg Flipped" style="margin: auto; margin-top: 10px; height: 80%;"/>

---
theme: monomi
layout: section
---

# What makes it special?

---
theme: monomi
layout: default
---

# Technology-Agnostic by Default

- Tanstack Philosphy (all libraries): Typescript Core + Framework adapters
    - Start supports React and Solid (Angular soon™)
- Hosting is simple and works everywhere
    - No vendor lock-in

---
theme: monomi
layout: default
---

# Client-Side First Philosophy

- SSR on first page load and only when you really want it
    - No `"use server"`/`"use client"` directives
- One of the best client-side routers to date
- Focus on highly interactive applications
- Well integrated with client-side caching (TanStack Query)

---
theme: monomi
layout: default
---

# Superior Developer Experience

- Extreme Typesafety without writing any types
- Minimal boilerplate
    - Little to no configuration
    - A Vite plugin autogenerates the boring parts
- Easier to migrate & learn (client-first, no unnecessary constraints)

---
theme: monomi
layout: default
---

# Feature Rich

Router + Start have all the features you need from a full stack routing library, for example:

**Router** 
- Search params as first class citizens
- Full layout control (shared, nested)
- Lifecycle hooks (auth guards, redirects, etc.)
- Global Context (Dependency Injection)
- Data loading, Prefetching & Caching
- Lazy loading, suspense & code splitting

**Start**
- Server Side Rendering
- Streaming
- Server functionalities