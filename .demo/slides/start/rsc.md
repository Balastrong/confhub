---
theme: monomi
layout: section
---


# What about <span class="grad-orange">RSC</span>?

## aka React Server Components

---
layout: default
---

# RSCs in short

<div class="grid grid-3" style="margin-top:24px">
  <div class="card">
    <div class="card-header">
      <div class="icon icon-blue icon-lg">⚡</div>
      <h3>Server execution</h3>
    </div>
    <p class="card-body">Async components that run once on the server.</p>
  </div>

  <div class="card">
    <div class="card-header">
      <div class="icon icon-green icon-lg">🗄️</div>
      <h3>Direct data access</h3>
    </div>
    <p class="card-body">They can talk to APIs and databases directly.</p>
  </div>

  <div class="card">
    <div class="card-header">
      <div class="icon icon-purple icon-lg">📦</div>
      <h3>Serialized output</h3>
    </div>
    <p class="card-body">The client receives UI plus the data it needs.</p>
  </div>
</div>

<div class="callout callout-info" style="margin-top:20px; width: fit-content; margin: auto">
  <p style="margin:0;font-size:1em">RSCs are another data delivery mechanism: caching, staleness, errors, and loading still need a strategy.</p>
</div>

---
layout: section
---

# <span class="grad-blue">TanStack Start</span> brings its own<br/>RSC Flavour!
