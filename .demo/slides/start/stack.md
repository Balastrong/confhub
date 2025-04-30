---
theme: monomi
layout: section
---

# How is all of that possible?

A couple words on the tech stack behind the scenes

---
layout: default
---

# Everything beings with Vinxi

Javascript SDK to build full stack applications, built on top of:

- Vite -> Client side
- Nitro -> Hosting
- Rollup -> Bundling

---
layout: default
---

<img src=".demo/assets/devinxi.png" alt="Devinxi" style="margin: auto" />


---
layout: default
---

# Why is vinxi being removed?

- The only maintainer works for Vercel and has no time to maintain it anymore
- Vite 6 new Environment APIs with primitives replacing vinxi's abstractions

---
layout: default
---

# Nitro remains in the stack

- Framework to build web servers
    - Built on top of H3, a minimalistic HTTP framework
- Comes with adapters for all major hosting providers