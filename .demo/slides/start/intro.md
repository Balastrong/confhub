---
theme: monomi
layout: default
---

# At some point you might need...

<div style="display:grid;grid-template-columns:repeat(2,minmax(250px,1fr));gap:18px;margin-top:24px;align-items:stretch">
  <div style="background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:20px;backdrop-filter:blur(3px);box-shadow:0 8px 22px rgba(0,0,0,.18)">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
      <div style="width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(59,130,246,.15);color:#93c5fd;font-size:22px">📄</div>
      <h3 style="margin:0;font-size:1.1em">Full-document SSR</h3>
    </div>
    <p style="margin:0;color:var(--slidev-theme-text-secondary,#cbd5e1);font-size:.95em">Complete server-side rendering</p>
  </div>

  <div style="background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:20px;backdrop-filter:blur(3px);box-shadow:0 8px 22px rgba(0,0,0,.18)">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
      <div style="width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(16,185,129,.15);color:#6ee7b7;font-size:22px">⚙️</div>
      <h3 style="margin:0;font-size:1.1em">Server Functions</h3>
    </div>
    <p style="margin:0;color:var(--slidev-theme-text-secondary,#cbd5e1);font-size:.95em">Backend logic made simple</p>
  </div>

  <div style="background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:20px;backdrop-filter:blur(3px);box-shadow:0 8px 22px rgba(0,0,0,.18)">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
      <div style="width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(139,92,246,.15);color:#d8b4fe;font-size:22px">🌊</div>
      <h3 style="margin:0;font-size:1.1em">Streaming</h3>
    </div>
    <p style="margin:0;color:var(--slidev-theme-text-secondary,#cbd5e1);font-size:.95em">Progressive content delivery</p>
  </div>

  <div style="background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:20px;backdrop-filter:blur(3px);box-shadow:0 8px 22px rgba(0,0,0,.18)">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
      <div style="width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(234,179,8,.15);color:#fde68a;font-size:22px">🌐</div>
      <h3 style="margin:0;font-size:1.1em">Public Endpoints</h3>
    </div>
    <p style="margin:0;color:var(--slidev-theme-text-secondary,#cbd5e1);font-size:.95em">API routes & external access</p>
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

<div style="display:grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:18px;margin-top:24px;align-items:stretch;overflow-x:auto">
  <div style="background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:20px;backdrop-filter:blur(3px);box-shadow:0 8px 22px rgba(0,0,0,.18)">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
      <div style="width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(99,102,241,.15);color:#a5b4fc;font-size:22px;font-weight:bold">1</div>
      <h3 style="margin:0;font-size:1.1em">Swap the Vite Plugin</h3>
    </div>
    <p style="margin:0;color:var(--slidev-theme-text-secondary,#cbd5e1);font-size:.95em">Replace TanStack Router plugin with TanStack Start</p>
  </div>

  <div style="background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:20px;backdrop-filter:blur(3px);box-shadow:0 8px 22px rgba(0,0,0,.18)">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
      <div style="width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(16,185,129,.15);color:#6ee7b7;font-size:22px;font-weight:bold">2</div>
      <h3 style="margin:0;font-size:1.1em">Move Router Setup</h3>
    </div>
    <p style="margin:0;color:var(--slidev-theme-text-secondary,#cbd5e1);font-size:.95em">Create a dedicated router.tsx file</p>
  </div>

  <div style="background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:20px;backdrop-filter:blur(3px);box-shadow:0 8px 22px rgba(0,0,0,.18)">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
      <div style="width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(234,179,8,.15);color:#fde68a;font-size:22px;font-weight:bold">3</div>
      <h3 style="margin:0;font-size:1.1em">Update Root Component</h3>
    </div>
    <p style="margin:0;color:var(--slidev-theme-text-secondary,#cbd5e1);font-size:.95em">Minor changes in __root.tsx</p>
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
