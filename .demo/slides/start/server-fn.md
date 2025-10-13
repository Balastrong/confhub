---
theme: monomi
layout: section
---

# Server Functions

## A special implementation of an isomorphic functions

---
layout: default
---

# A Server Function

<div style="display:grid;grid-template-columns:repeat(3,minmax(280px,1fr));gap:18px;margin-top:20px;align-items:stretch">
  <div style="background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:18px;backdrop-filter:blur(3px);box-shadow:0 8px 22px rgba(0,0,0,.18)">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
      <div style="width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(244,63,94,.15);color:#fca5a5;font-size:20px">🖥️</div>
      <h3 style="margin:0;font-size:1.05em">Server-Only Execution</h3>
    </div>
    <p style="margin:0;;font-size:.95em">Runs only on the server, code never reaches the client bundle</p>
  </div>

  <div style="background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:18px;backdrop-filter:blur(3px);box-shadow:0 8px 22px rgba(0,0,0,.18)">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
      <div style="width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(59,130,246,.15);color:#93c5fd;font-size:20px">🌐</div>
      <h3 style="margin:0;font-size:1.05em">HTTP Endpoint</h3>
    </div>
    <p style="margin:0;;font-size:.95em">Automatically creates an HTTP endpoint for client access</p>
  </div>


  <div style="background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:18px;backdrop-filter:blur(3px);box-shadow:0 8px 22px rgba(0,0,0,.18)">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
      <div style="width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(234,179,8,.15);color:#fde68a;font-size:20px">🔒</div>
      <h3 style="margin:0;font-size:1.05em">Security First</h3>
    </div>
    <p style="margin:0;;font-size:.95em">Safest way to manage secrets & database connections</p>
  </div>
</div>

<div style="background:linear-gradient(135deg,rgba(16,185,129,.1),rgba(59,130,246,.1));border:1px solid rgba(16,185,129,.3);border-radius:14px;padding:20px;margin-top:24px">
  <h4 style="margin:0 0 8px 0;color:#60a5fa;font-size:1.1em">Calling it from...</h4>
  <div style="display:flex;flex-direction:column;gap:8px">
    <div style="display:flex;align-items:center;gap:12px">
      <div style="width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(59,130,246,.2);color:#93c5fd;font-size:12px;font-weight:bold">S</div>
      <span style=";font-size:.95em"><strong>Server:</strong> Runs the function directly</span>
    </div>
    <div style="display:flex;align-items:center;gap:12px">
      <div style="width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(16,185,129,.2);color:#6ee7b7;font-size:12px;font-weight:bold">C</div>
      <span style=";font-size:.95em"><strong>Client:</strong> Makes a fetch request to the generated endpoint</span>
    </div>
  </div>
</div>


```ts
// Client or server, it always works
const response = await getData()
```