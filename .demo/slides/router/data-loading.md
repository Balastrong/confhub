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

<div class="callout callout-tip" style="margin-top:18px;width:fit-content;margin:auto">
  <p style="margin:0">This works great when data is bound to a specific route.</p>
</div>