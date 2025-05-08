---
theme: monomi
layout: section
---

# React is going on the Server

---
theme: monomi
layout: default
---

# SSR brings a lot of benefits

- Improved Initial Load Performance
- Enhanced SEO Capabilities
- Reduced Client-Side JavaScript

Nextjs pushes a lot on React Server Components (RSC)

---
theme: monomi
layout: default
---

# Rendering on the client still makes sense

- Highly Interactive Applications
- Smooth User Experience and Navigation
- Cheaper Hosting

---
theme: monomi
layout: section
---

# The right tool for the job

## Where is TanStack Start positioned

---
theme: default
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

- SSR on first load and only when you really want it
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

# Features Rich

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
- Server functions