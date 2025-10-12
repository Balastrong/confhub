---
theme: monomi
layout: section
---

# What about React Server Components?

---
layout: default
---

# RSCs in short

<div style="display:grid;grid-template-columns:repeat(3,minmax(200px,1fr));gap:20px;margin-top:24px;align-items:stretch">
  <div style="background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:20px;backdrop-filter:blur(3px);box-shadow:0 8px 22px rgba(0,0,0,.18)">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
      <div style="width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(59,130,246,.15);color:#93c5fd;font-size:22px">⚡</div>
      <h3 style="margin:0;font-size:1.1em">Server Execution</h3>
    </div>
    <p style="margin:0;;font-size:.95em">Asynchronous React components that run once on the server</p>
  </div>

  <div style="background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:20px;backdrop-filter:blur(3px);box-shadow:0 8px 22px rgba(0,0,0,.18)">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
      <div style="width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(16,185,129,.15);color:#6ee7b7;font-size:22px">🗄️</div>
      <h3 style="margin:0;font-size:1.1em">Direct Data Access</h3>
    </div>
    <p style="margin:0;;font-size:.95em">Can fetch data, access databases, and call APIs directly</p>
  </div>

  <div style="background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:20px;backdrop-filter:blur(3px);box-shadow:0 8px 22px rgba(0,0,0,.18)">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
      <div style="width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(139,92,246,.15);color:#d8b4fe;font-size:22px">📦</div>
      <h3 style="margin:0;font-size:1.1em">Serialized Output</h3>
    </div>
    <p style="margin:0;;font-size:.95em">Returns serialized UI to the client with data baked in</p>
  </div>
</div>

<br />

```tsx
async function MyServerComponent() {
  const data = await sql`SELECT title FROM posts WHERE id = 1`
  return <div>{data.title}</div>
}
```

---
layout: default
---

# Just another way to fetch data in React

<div style="display:grid;grid-template-columns:1fr;gap:20px;margin-top:24px">
  <div style="background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:24px;backdrop-filter:blur(3px);box-shadow:0 8px 22px rgba(0,0,0,.18)">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
      <div style="width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(234,179,8,.15);color:#fde68a;font-size:22px">⚠️</div>
      <h3 style="margin:0;font-size:1.2em">Same Old Challenges</h3>
    </div>
    <p style="margin:0 0 12px 0;;font-size:1em">Mixing UI with data means having to deal with the same issues as other data fetching strategies:</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-top:16px">
      <div style="display:flex;align-items:center;gap:8px">
        <div style="width:6px;height:6px;border-radius:50%;background:rgba(244,63,94,.8)"></div>
        <span style=";font-size:.95em">Caching</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <div style="width:6px;height:6px;border-radius:50%;background:rgba(244,63,94,.8)"></div>
        <span style=";font-size:.95em">Staleness</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <div style="width:6px;height:6px;border-radius:50%;background:rgba(244,63,94,.8)"></div>
        <span style=";font-size:.95em">Error handling</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <div style="width:6px;height:6px;border-radius:50%;background:rgba(244,63,94,.8)"></div>
        <span style=";font-size:.95em">Loading states</span>
      </div>
    </div>
    <div style="margin-top:20px;padding:16px;background:rgba(16,185,129,.1);border:1px solid rgba(16,185,129,.3);border-radius:10px;text-align:center">
      <p style="margin:0;color:#60a5fa;font-size:1em;font-weight:500">...did anyone say "TanStack Query"?</p>
    </div>
  </div>
</div>

---
layout: section
---

# RSC support in TanStack Start coming soon!

## ...as just another way of fetching data for a client-first app.
