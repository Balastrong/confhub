---
theme: monomi
layout: section
---

# External data loading 🤝 routing

##  The two things are deeply connected

---
layout: default
---

# When your router knows about data loading

<div style="display:grid;grid-template-columns:repeat(2,minmax(300px,1fr));gap:20px;margin-top:24px;align-items:stretch">
  <div style="background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:20px;backdrop-filter:blur(3px);box-shadow:0 8px 22px rgba(0,0,0,.18)">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
      <div style="width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(59,130,246,.15);color:#93c5fd;font-size:22px">⚡</div>
      <h3 style="margin:0;font-size:1.1em">Preloading During Navigation</h3>
    </div>
    <p style="margin:0;color:#cbd5e1;font-size:.95em">Data loading can begin during navigation, even before rendering starts</p>
  </div>

  <div style="background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:20px;backdrop-filter:blur(3px);box-shadow:0 8px 22px rgba(0,0,0,.18)">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
      <div style="width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(16,185,129,.15);color:#6ee7b7;font-size:22px">💾</div>
      <h3 style="margin:0;font-size:1.1em">Smart Caching</h3>
    </div>
    <p style="margin:0;color:#cbd5e1;font-size:.95em">Data bound to routes benefits from built-in cache or integrates seamlessly with TanStack Query</p>
  </div>
</div>
