---
theme: monomi
layout: section
---


# Did we really need another React <span class="grad-orange">framework</span>?

---
layout: section
---

# Having multiple <span class="grad-green">options</span><br/>is usually good

## Next.js is <span class="grad-purple">server-first</span>. TanStack Start stays <span class="grad-blue">client-first</span>.

---
layout: default
---

# TanStack Start <span class="grad-blue">strengths</span>

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
    <p class="card-body">Strong guarantees without you having to write types, thanks <span class="grad-blue">inference</span>.</p>
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

# <span class="grad-blue">Start</span> = <span class="grad-green">Router</span> + <span class="grad-blue">Server Capabilities</span>

## TanStack Router covers ~<span class="grad-yellow">80%</span> of the functionalities

---
layout: default
---

<img src=".demo/slides/img/router.png" alt="TanStack Router" style="width: 100%; height: auto; object-fit: contain;" />
---
layout: section
---

# Picking a <span class="grad-green">modern router</span> means defining most of your app <span class="grad-purple">architecture</span>

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

# Let's look at some <span class="grad-orange">code</span>!

## _These slides are inside VSCode for a reason_