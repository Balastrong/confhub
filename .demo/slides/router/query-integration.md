---
theme: monomi
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

---
layout: section
---

# <span class="grad-green">Router</span> starts the fetch<br/><span class="grad-red">Query</span> owns the data (& cache)