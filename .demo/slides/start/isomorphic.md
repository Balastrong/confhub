---
theme: monomi
layout: section
---

# Everything is isomorphic by default

---
layout: default
---

# What does isomorphic mean here?

<div style="display:grid;grid-template-columns:repeat(3,minmax(200px,1fr));gap:20px;margin-top:24px;align-items:stretch">
  <div style="background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:20px;backdrop-filter:blur(3px);box-shadow:0 8px 22px rgba(0,0,0,.18)">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
      <div style="width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(59,130,246,.15);color:#93c5fd;font-size:22px">🔄</div>
      <h3 style="margin:0;font-size:1.1em">Universal Code</h3>
    </div>
    <p style="margin:0;;font-size:.95em">Your code can run on <strong>both</strong> server and client seamlessly</p>
  </div>

  <div style="background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:20px;backdrop-filter:blur(3px);box-shadow:0 8px 22px rgba(0,0,0,.18)">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
      <div style="width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(16,185,129,.15);color:#6ee7b7;font-size:22px">🎯</div>
      <h3 style="margin:0;font-size:1.1em">Environment Control</h3>
    </div>
    <p style="margin:0;;font-size:.95em">Choose to run code <strong>only</strong> on server or client when needed</p>
  </div>

  <div style="background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:20px;backdrop-filter:blur(3px);box-shadow:0 8px 22px rgba(0,0,0,.18)">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
      <div style="width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(139,92,246,.15);color:#d8b4fe;font-size:22px">⚙️</div>
      <h3 style="margin:0;font-size:1.1em">Flexible Behaviors</h3>
    </div>
    <p style="margin:0;;font-size:.95em">Define <strong>different behaviors</strong> for server and client environments</p>
  </div>
</div>

<br />

```tsx
export const Route = createFileRoute("/items")({
  ssr: true, // Default true, can also be false or 'data-only'
  loader: () => {
    // ✅ This can run on BOTH server and client
  },
  component: RouteComponent,
})
```
