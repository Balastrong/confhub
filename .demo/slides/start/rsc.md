---
theme: monomi
layout: section
TODO: We have to do this from scratch
---


# What about <span class="grad-orange">RSC?</span>

## (React Server Components)

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

<div class="callout callout-info" style="margin-top:20px">
  <p style="margin:0;font-size:1em">RSCs are another delivery mechanism, not a replacement for thinking about data flow.</p>
</div>

---
layout: default
---

# RSCs are still kind of a <span class="grad-blue">data fetching</span> primitive

<div class="card" style="margin-top:24px">
  <div class="card-header">
    <div class="icon icon-yellow icon-lg">⚠️</div>
    <h3>The tradeoffs do not disappear</h3>
  </div>
  <p class="card-body">Caching, staleness, errors, and loading still need a strategy.</p>
</div>

<div class="callout callout-tip" style="margin-top:20px">
  <p style="margin:0;font-size:1em">That is exactly why TanStack Query still makes sense in a Start app.</p>
</div>

---
layout: section
---

# <span class="grad-blue">TanStack Start</span> brings its own<br/>RSC Flavour!

---
layout: default
---

# RSC in Start

<div class="grid grid-2" style="margin-top:24px">
  <div class="card">
    <div class="card-header">
      <div class="icon icon-blue icon-lg">🖥️</div>
      <h3>Rendered on the server</h3>
    </div>
    <p class="card-body">The component is rendered in a server function.</p>
  </div>

  <div class="card">
    <div class="card-header">
      <div class="icon icon-green icon-lg">📡</div>
      <h3>Returned through the loader</h3>
    </div>
    <p class="card-body">The loader returns it with the rest of the route data.</p>
  </div>

  <div class="card">
    <div class="card-header">
      <div class="icon icon-purple icon-lg">⚛️</div>
      <h3>Streamed into the page</h3>
    </div>
    <p class="card-body">React receives it and renders it into the page.</p>
  </div>

  <div class="card">
    <div class="card-header">
      <div class="icon icon-yellow icon-lg">🔒</div>
      <h3>Server logic stays server-side</h3>
    </div>
    <p class="card-body">Data, secrets, and heavy code stay off the client.</p>
  </div>
</div>
