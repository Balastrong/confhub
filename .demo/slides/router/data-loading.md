---
theme: monomi
layout: section
---


# External data loading 🤝 <span class="grad-green">routing</span>

## The two concerns are deeply <span class="grad-purple">connected</span>

---
layout: default
---

# Your router can <span class="grad-green">orchestrate</span> data loading

<div class="grid grid-auto" style="margin-top:20px">
  <div class="card card-sm">
    <div class="card-header">
      <div class="icon icon-blue">🖱️</div>
      <h3>Preload on intent</h3>
    </div>
    <p class="card-body">Fetching starts on hover, before the user even clicks.</p>
  </div>

  <div class="card card-sm">
    <div class="card-header">
      <div class="icon icon-green">⚡</div>
      <h3>Loader runs first</h3>
    </div>
    <p class="card-body">Data is in flight before the component even downloads.</p>
  </div>

  <div class="card card-sm">
    <div class="card-header">
      <div class="icon icon-purple">♻️</div>
      <h3>Built-in stale cache</h3>
    </div>
    <p class="card-body">Fresh data is reused across navigations.</p>
  </div>
</div>

<div class="callout callout-tip" style="margin-top:18px">
  <p style="margin:0">This works fine for data bound to a specific route.</p>
</div>

---
layout: default
---

# Router cache <span class="grad-purple">or</span> TanStack Query?

<div class="grid grid-2" style="margin-top:20px">
  <div class="card">
    <div class="card-header">
      <div class="icon icon-blue">🧭</div>
      <h3>Router cache</h3>
    </div>
    <p class="card-body">Per-route, built-in, zero setup. Perfect for route-specific data.</p>
  </div>

  <div class="card card-accent">
    <div class="card-header">
      <div class="icon icon-green">🔁</div>
      <h3>TanStack Query</h3>
    </div>
    <p class="card-body">Global cache, shared across routes. Prime it from loaders.</p>
  </div>
</div>

<div class="callout callout-warn" style="margin-top:18px">
  <p style="margin:0">When using Query, you could even disable the router cache.</p>
</div>
