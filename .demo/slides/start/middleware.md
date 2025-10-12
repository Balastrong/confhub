---
theme: monomi
layout: section
---

# Server Functions work by exposing HTTP endpoints

## You might want to protect them with authentication

---
layout: section
---

# Middlewares

## Run logic before/after a server function or route

---
layout: default
---

# Middleware use cases

<div style="display:grid;grid-template-columns:repeat(2,minmax(250px,1fr));gap:18px;margin-top:20px;align-items:stretch">
  <div style="background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:18px;backdrop-filter:blur(3px);box-shadow:0 8px 22px rgba(0,0,0,.18)">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
      <div style="width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(244,63,94,.15);color:#fca5a5;font-size:20px">🔐</div>
      <h3 style="margin:0;font-size:1.05em">Authentication</h3>
    </div>
    <p style="margin:0;color:var(--slidev-theme-text-secondary,#cbd5e1);font-size:.95em">Protect routes and verify user identity</p>
  </div>

  <div style="background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:18px;backdrop-filter:blur(3px);box-shadow:0 8px 22px rgba(0,0,0,.18)">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
      <div style="width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(59,130,246,.15);color:#93c5fd;font-size:20px">📊</div>
      <h3 style="margin:0;font-size:1.05em">Observability</h3>
    </div>
    <p style="margin:0;color:var(--slidev-theme-text-secondary,#cbd5e1);font-size:.95em">Logging, monitoring & analytics</p>
  </div>

  <div style="background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:18px;backdrop-filter:blur(3px);box-shadow:0 8px 22px rgba(0,0,0,.18)">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
      <div style="width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(16,185,129,.15);color:#6ee7b7;font-size:20px">🔗</div>
      <h3 style="margin:0;font-size:1.05em">Context Provider</h3>
    </div>
    <p style="margin:0;color:var(--slidev-theme-text-secondary,#cbd5e1);font-size:.95em">Inject dependencies and shared data</p>
  </div>

  <div style="background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:18px;backdrop-filter:blur(3px);box-shadow:0 8px 22px rgba(0,0,0,.18)">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
      <div style="width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(234,179,8,.15);color:#fde68a;font-size:20px">⚠️</div>
      <h3 style="margin:0;font-size:1.05em">Error Handling</h3>
    </div>
    <p style="margin:0;color:var(--slidev-theme-text-secondary,#cbd5e1);font-size:.95em">Consistent error processing & responses</p>
  </div>
</div>

---
layout: default
---

# Middleware features

<div style="display:grid;grid-template-columns:repeat(2,minmax(250px,1fr));gap:18px;margin-top:20px;align-items:stretch">
  <div style="background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:18px;backdrop-filter:blur(3px);box-shadow:0 8px 22px rgba(0,0,0,.18)">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
      <div style="width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(139,92,246,.15);color:#d8b4fe;font-size:20px">🔗</div>
      <h3 style="margin:0;font-size:1.05em">Chainable</h3>
    </div>
    <p style="margin:0;color:var(--slidev-theme-text-secondary,#cbd5e1);font-size:.95em">Can be chained and composed together</p>
  </div>

  <div style="background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:18px;backdrop-filter:blur(3px);box-shadow:0 8px 22px rgba(0,0,0,.18)">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
      <div style="width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(244,63,94,.15);color:#fca5a5;font-size:20px">🛑</div>
      <h3 style="margin:0;font-size:1.05em">Request Control</h3>
    </div>
    <p style="margin:0;color:var(--slidev-theme-text-secondary,#cbd5e1);font-size:.95em">Can abort the request when needed</p>
  </div>

  <div style="background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:18px;backdrop-filter:blur(3px);box-shadow:0 8px 22px rgba(0,0,0,.18)">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
      <div style="width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(59,130,246,.15);color:#93c5fd;font-size:20px">✏️</div>
      <h3 style="margin:0;font-size:1.05em">Data Modification</h3>
    </div>
    <p style="margin:0;color:var(--slidev-theme-text-secondary,#cbd5e1);font-size:.95em">Can modify request and response data</p>
  </div>

  <div style="background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:18px;backdrop-filter:blur(3px);box-shadow:0 8px 22px rgba(0,0,0,.18)">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
      <div style="width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(16,185,129,.15);color:#6ee7b7;font-size:20px">⚡</div>
      <h3 style="margin:0;font-size:1.05em">Universal</h3>
    </div>
    <p style="margin:0;color:var(--slidev-theme-text-secondary,#cbd5e1);font-size:.95em">Runs before/after handlers (client & server)</p>
  </div>
</div>
