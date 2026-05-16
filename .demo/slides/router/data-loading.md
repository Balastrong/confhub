---
theme: monomi
layout: section
---


# External data loading 🤝 <span class="grad-green">routing</span>

## The two concerns are deeply <span class="grad-purple">connected</span>

---
layout: default
---

# When your router knows about <span class="grad-green">data loading</span>

<div class="grid grid-2" style="margin-top:24px">
  <div class="card">
    <div class="card-header">
      <div class="icon icon-blue icon-lg">⚡</div>
      <h3>Preload on navigation</h3>
    </div>
    <p class="card-body">Fetching can start before the next screen renders.</p>
  </div>

  <div class="card">
    <div class="card-header">
      <div class="icon icon-green icon-lg">💾</div>
      <h3>Route-aware caching</h3>
    </div>
    <p class="card-body">Route data can reuse the router's caching model.</p>
  </div>

  <div class="card card-accent span-full">
    <div class="card-header">
      <div class="icon icon-indigo">🤝</div>
      <h3>Router + Query</h3>
    </div>
    <p class="card-body">Navigation and caching line up without extra framework <span class="grad-orange">ceremony</span>.</p>
  </div>
</div>
