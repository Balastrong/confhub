---
theme: monomi
layout: default
---


# At some point you might need...

<div class="grid grid-2" style="margin-top:24px">
  <div class="card">
    <div class="card-header">
      <div class="icon icon-blue icon-lg">📄</div>
      <h3>Full-document SSR</h3>
    </div>
    <p class="card-body">Render some or all of the page on the server.</p>
  </div>

  <div class="card">
    <div class="card-header">
      <div class="icon icon-green icon-lg">⚙️</div>
      <h3>Server Functions</h3>
    </div>
    <p class="card-body">Keep backend logic inside the same app codebase.</p>
  </div>

  <div class="card">
    <div class="card-header">
      <div class="icon icon-purple icon-lg">🔗</div>
      <h3>End-to-end typesafety</h3>
    </div>
    <p class="card-body">Share types across client and server boundaries.</p>
  </div>

  <div class="card">
    <div class="card-header">
      <div class="icon icon-yellow icon-lg">🌐</div>
      <h3>Public endpoints</h3>
    </div>
    <p class="card-body">Expose stable HTTP endpoints when external access matters.</p>
  </div>
</div>

---
layout: default
---

<img src=".demo/slides/img/start.png" alt="TanStack Start" style="width: 100%; height: auto; object-fit: contain;" />

---
layout: default
---

# Migration is simple

<div class="grid grid-3" style="margin-top:24px">
  <div class="card">
    <div class="card-header">
      <div class="step-num icon-indigo">1</div>
      <h3>Swap the plugin</h3>
    </div>
    <p class="card-body">Replace the Router Vite plugin with Start.</p>
  </div>

  <div class="card">
    <div class="card-header">
      <div class="step-num icon-green">2</div>
      <h3>Move router setup</h3>
    </div>
    <p class="card-body">Give the router its own dedicated file.</p>
  </div>

  <div class="card">
    <div class="card-header">
      <div class="step-num icon-yellow">3</div>
      <h3>Touch the root</h3>
    </div>
    <p class="card-body">Make the small wiring changes in <code>__root.tsx</code>.</p>
  </div>
</div>

```diff
+import { tanstackStart } from '@tanstack/react-start/plugin/vite'
-import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
+    tanstackStart(),
-    TanStackRouterVite()
  ],
})
```

---
layout: section
---

# ...a full-stack framework literally inside a vite plugin
