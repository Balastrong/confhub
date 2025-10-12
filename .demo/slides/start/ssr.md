---
theme: monomi
layout: section
---

# SSR with the benefits of SPA

---
layout: default
---

# Server Side Rendering in TanStack Start

<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:20px;margin-top:24px;align-items:stretch">
  <div style="background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:20px;backdrop-filter:blur(3px);box-shadow:0 8px 22px rgba(0,0,0,.18)">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
      <div style="width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(59,130,246,.15);color:#93c5fd;font-size:22px">🔄</div>
      <h3 style="margin:0;font-size:1.1em">First Load (from outside)</h3>
    </div>
    <div style="margin-bottom:12px">
      <p style="margin:0 0 8px 0;color:#cbd5e1;font-size:.95em">By default the page is rendered on the server</p>
    </div>
    <div style="display:flex;flex-direction:column;gap:6px">
      <div style="display:flex;align-items:center;gap:8px">
        <div style="width:6px;height:6px;border-radius:50%;background:rgba(16,185,129,.8)"></div>
        <span style="color:#cbd5e1;font-size:.9em">SEO friendly</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <div style="width:6px;height:6px;border-radius:50%;background:rgba(16,185,129,.8)"></div>
        <span style="color:#cbd5e1;font-size:.9em">Supports streaming (also selective)</span>
      </div>
    </div>
  </div>

  <div style="background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02));border:1x solid rgba(255,255,255,.12);border-radius:14px;padding:20px;backdrop-filter:blur(3px);box-shadow:0 8px 22px rgba(0,0,0,.18)">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
      <div style="width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(16,185,129,.15);color:#6ee7b7;font-size:22px">⚡</div>
      <h3 style="margin:0;font-size:1.1em">Subsequent Navigations</h3>
    </div>
    <div style="margin-bottom:12px">
      <p style="margin:0 0 8px 0;color:#cbd5e1;font-size:.95em">Within the app</p>
    </div>
    <div style="display:flex;flex-direction:column;gap:6px">
      <div style="display:flex;align-items:center;gap:8px">
        <div style="width:6px;height:6px;border-radius:50%;background:rgba(16,185,129,.8)"></div>
        <span style="color:#cbd5e1;font-size:.9em">Client-side navigation</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <div style="width:6px;height:6px;border-radius:50%;background:rgba(16,185,129,.8)"></div>
        <span style="color:#cbd5e1;font-size:.9em">Fast and smooth SPA feel</span>
      </div>
    </div>
  </div>
</div>

<div style="background:linear-gradient(135deg,rgba(99,102,241,.1),rgba(59,130,246,.1));border:1px solid rgba(99,102,241,.3);border-radius:14px;padding:20px;margin-top:24px;text-align:center">
  <p style="margin:0;font-style:italic;color:#cbd5e1;font-size:1em">There are options to customize this behavior</p>
</div>