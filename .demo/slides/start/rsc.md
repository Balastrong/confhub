---
theme: monomi
layout: section
TODO: We have to do this from scratch
---


# What about React <span class="grad-orange">Server Components</span>?

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

# RSCs are still <span class="grad-blue">data fetching</span>

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

# RSC is <span class="grad-lime">now available</span> in TanStack Start

## Just another way to fetch data for a <span class="grad-blue">client-first</span> app.

---
layout: default
---

# RSC in one file

<div class="grid grid-2" style="margin-top:24px">
  <div class="card">
    <div class="card-header">
      <div class="icon icon-blue icon-lg">🖥️</div>
      <h3>Server component</h3>
    </div>
    <p class="card-body">An async component rendered inside a <code>createServerFn</code>.</p>
  </div>

  <div class="card">
    <div class="card-header">
      <div class="icon icon-green icon-lg">📡</div>
      <h3><code>renderServerComponent</code></h3>
    </div>
    <p class="card-body">Converts JSX to an RSC flight stream, returned from the loader.</p>
  </div>

  <div class="card">
    <div class="card-header">
      <div class="icon icon-purple icon-lg">⚛️</div>
      <h3>Client renders it</h3>
    </div>
    <p class="card-body"><code>useLoaderData()</code> returns a renderable value — drop it in JSX.</p>
  </div>

  <div class="card">
    <div class="card-header">
      <div class="icon icon-yellow icon-lg">🔒</div>
      <h3>Server-only code</h3>
    </div>
    <p class="card-body">The async component has full access to DB, secrets, and Node.js APIs.</p>
  </div>
</div>
