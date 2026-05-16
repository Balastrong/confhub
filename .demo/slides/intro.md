---
theme: monomi
layout: section
---


# Did we really need another React framework?

---
layout: section
---

# Having multiple options/choices is usually good

## Next.js is server-first. TanStack Start stays client-first.

---
layout: default
---

<img src=".demo/slides/img/start.png" alt="TanStack Start" style="width: 100%; height: auto; object-fit: contain;" />


---
layout: default
---

# TanStack Start strengths

<div class="grid grid-auto" style="margin-top:16px">
  <div class="card card-sm">
    <div class="card-header">
      <div class="icon icon-indigo">🧭</div>
      <h3>TanStack Router</h3>
    </div>
    <p class="card-body">The best routing library as of today.</p>
  </div>

  <div class="card card-sm">
    <div class="card-header">
      <div class="icon icon-green">✅</div>
      <h3>Real type safety</h3>
    </div>
    <p class="card-body">Strong guarantees without  you having to write types (thanks inference).</p>
  </div>

  <div class="card card-sm">
    <div class="card-header">
      <div class="icon icon-blue">♻️</div>
      <h3>Isomorphic by default</h3>
    </div>
    <p class="card-body">SSR & server functions with a client-first approach.</p>
  </div>

  <div class="card card-sm">
    <div class="card-header">
      <div class="icon icon-yellow">🛠️</div>
      <h3>Developer experience</h3>
    </div>
    <p class="card-body">The framework helps you, doesn't fight you.</p>
  </div>

  <div class="card card-sm">
    <div class="card-header">
      <div class="icon icon-red">🚀</div>
      <h3>Universal deployment</h3>
    </div>
    <p class="card-body">Vite and adapters keep hosting choices open.</p>
  </div>

  <div class="card card-sm">
    <div class="card-header">
      <div class="icon icon-purple">🤝</div>
      <h3>Fast-moving community</h3>
    </div>
    <p class="card-body">Maintainers are helpful and examples are easy to find.</p>
  </div>
</div>

---
layout: section
---

# Start = Router + Server Capabilities

## TanStack Router covers ~80% of the functionalities

---
layout: section
---

# Picking a router means defining most of your app architecture

---
layout: default
---

# _Router == Framework_ (?)

Modern routers take care of a lot of things:

<div class="grid grid-2" style="margin-top:20px">
  <div class="card">
    <div class="card-header">
      <div class="icon icon-yellow">🛠️</div>
      <h3>Developer workflow</h3>
    </div>
    <p class="card-body">Folder structure, HMR, code splitting, and devtools.</p>
  </div>

  <div class="card">
    <div class="card-header">
      <div class="icon icon-indigo">🧩</div>
      <h3>Components & UI hierarchy</h3>
    </div>
    <p class="card-body">Layouts, nesting, and shared component boundaries.</p>
  </div>

  <div class="card">
    <div class="card-header">
      <div class="icon icon-green">🔄</div>
      <h3>Data lifecycle</h3>
    </div>
    <p class="card-body">Loaders, prefetching, caching, and invalidation.</p>
  </div>

  <div class="card">
    <div class="card-header">
      <div class="icon icon-blue">🌐</div>
      <h3>State management</h3>
    </div>
    <p class="card-body">Context, global state, and URL-driven state.</p>
  </div>
</div>

---
layout: section
---

# Let's see what Router can do

## _Reminder: TanStack Start has all these features + server capabilities_