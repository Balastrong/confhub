---
theme: monomi
layout: section
---

# Did we really need another React framework?

---
layout: section
---

# Having multiple options/choices is usually good

## NextJs is server-first, TanStack Start is client-first

---
layout: default
---

# TanStack Start strengths

<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:18px;margin-top:12px;align-items:stretch">
  <div style="background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:16px;backdrop-filter:blur(3px);box-shadow:0 8px 22px rgba(0,0,0,.18)">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
      <div style="width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(99,102,241,.15);color:#a5b4fc;font-size:20px">🧭</div>
      <h3 style="margin:0;font-size:1.05em">TanStack Router</h3>
    </div>
    <p style="margin:0;;font-size:.95em">The best routing library you've ever seen</p>
  </div>

  <div style="background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:16px;backdrop-filter:blur(3px);box-shadow:0 8px 22px rgba(0,0,0,.18)">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
      <div style="width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(16,185,129,.15);color:#6ee7b7;font-size:20px">✅</div>
      <h3 style="margin:0;font-size:1.05em">Real type-safety</h3>
    </div>
    <p style="margin:0;;font-size:.95em">Strong types without you having to write them</p>
  </div>

  <div style="background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:16px;backdrop-filter:blur(3px);box-shadow:0 8px 22px rgba(0,0,0,.18)">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
      <div style="width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(59,130,246,.15);color:#93c5fd;font-size:20px">♻️</div>
      <h3 style="margin:0;font-size:1.05em">Isomorphism</h3>
    </div>
    <p style="margin:0;;font-size:.95em">SSR & server functions with a client-first approach</p>
  </div>

  <div style="background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:16px;backdrop-filter:blur(3px);box-shadow:0 8px 22px rgba(0,0,0,.18)">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
      <div style="width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(234,179,8,.15);color:#fde68a;font-size:20px">🛠️</div>
      <h3 style="margin:0;font-size:1.05em">Developer experience</h3>
    </div>
    <p style="margin:0;;font-size:.95em">The framework helps you, doesn't fight you</p>
  </div>

  <div style="background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:16px;backdrop-filter:blur(3px);box-shadow:0 8px 22px rgba(0,0,0,.18)">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
      <div style="width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(244,63,94,.15);color:#fca5a5;font-size:20px">🚀</div>
      <h3 style="margin:0;font-size:1.05em">Universal deployment</h3>
    </div>
    <p style="margin:0;;font-size:.95em">Powered by Vite ecosystem & adapters</p>
  </div>

  <div style="background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:16px;backdrop-filter:blur(3px);box-shadow:0 8px 22px rgba(0,0,0,.18)">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
      <div style="width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(139,92,246,.15);color:#d8b4fe;font-size:20px">🤝</div>
      <h3 style="margin:0;font-size:1.05em">Community</h3>
    </div>
    <p style="margin:0;;font-size:.95em">Active & helpful, join the official Discord</p>
  </div>
</div>

---
layout: section
---

# Start = Router + Server Capabilities

## TanStack Router covers ~80% of the functionalities

---
layout: section
---

# Picking a router means defining most of your app architecture

---
layout: default
---

# _Router == Framework_ (?)

Modern routers take care of a lot of things:

<div style="display:grid;grid-template-columns:repeat(2,minmax(280px,1fr));gap:18px;margin-top:20px;align-items:stretch">
  <div style="background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:18px;backdrop-filter:blur(3px);box-shadow:0 8px 22px rgba(0,0,0,.18)">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
      <div style="width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(99,102,241,.15);color:#a5b4fc;font-size:20px">🧩</div>
      <h3 style="margin:0;font-size:1.05em">Component & Layouts Hierarchy</h3>
    </div>
    <p style="margin:0;;font-size:.95em">Nested layouts, shared UI, component boundaries</p>
  </div>

  <div style="background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:18px;backdrop-filter:blur(3px);box-shadow:0 8px 22px rgba(0,0,0,.18)">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
      <div style="width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(16,185,129,.15);color:#6ee7b7;font-size:20px">🔄</div>
      <h3 style="margin:0;font-size:1.05em">Data Lifecycle</h3>
    </div>
    <p style="margin:0;;font-size:.95em">Loaders, prefetching & caching</p>
  </div>

  <div style="background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:18px;backdrop-filter:blur(3px);box-shadow:0 8px 22px rgba(0,0,0,.18)">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
      <div style="width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(59,130,246,.15);color:#93c5fd;font-size:20px">🌐</div>
      <h3 style="margin:0;font-size:1.05em">State Management</h3>
    </div>
    <p style="margin:0;;font-size:.95em">Global state, context, prop drilling</p>
  </div>

  <div style="background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:18px;backdrop-filter:blur(3px);box-shadow:0 8px 22px rgba(0,0,0,.18)">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
      <div style="width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(234,179,8,.15);color:#fde68a;font-size:20px">🛠️</div>
      <h3 style="margin:0;font-size:1.05em">Developer Experience</h3>
    </div>
    <p style="margin:0;;font-size:.95em">Folder structure, HMR, code splitting & devtools</p>
  </div>
</div>

---
layout: section
---

# Let's see what Router can do

## _Reminder: TanStack Start has all these features + server capabilities_