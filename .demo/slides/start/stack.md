---
theme: monomi
layout: section
---

# How is all of that possible?

A couple words on the tech stack behind the scenes

---
layout: section
---

# Everything beings with Vinxi

Javascript SDK to build full stack applications Nitro and Vite

---
layout: default
---

<img src=".demo/assets/devinxi.png" alt="Devinxi" style="margin: auto" />

---
layout: default
---

# Why is vinxi being removed?

- The only maintainer works for Vercel and has no time to maintain it anymore
- Vite 6 new Environment APIs includes primitives replacing vinxi's abstractions

---
layout: section
---

# It's Vite + Nitro now

---
layout: default
---

# Vite

- Start plugin (boilerplate generator, file-based routing, etc.)
- Development server with Hot Module Replacement
- SSR support
- Code splitting and bundling

---
layout: default
---

# Nitro

- Framework to build web servers (Nuxt engine)
    - Supports server file-based routing by default
    - Built on top of H3, a minimalistic HTTP framework
- Comes with adapters for all major hosting providers
