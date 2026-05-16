---
theme: monomi
layout: section
---


# <span class="grad-orange">SSR</span> with the benefits of <span class="grad-green">SPA</span>

---
layout: default
---

# Server Side Rendering in TanStack <span class="grad-blue">Start</span>

<div class="grid grid-2" style="margin-top:24px">
  <div class="card">
    <div class="card-header">
      <div class="icon icon-blue icon-lg">🔄</div>
      <h3>First load</h3>
    </div>
    <p class="card-body">The initial request renders on the server.</p>
    <div class="dot-list">
      <div class="dot-item">
        <span class="dot dot-green"></span>
        <span>SEO-friendly HTML</span>
      </div>
      <div class="dot-item">
        <span class="dot dot-green"></span>
        <span>Streaming when you need it</span>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      <div class="icon icon-green icon-lg">⚡</div>
      <h3>Next navigations</h3>
    </div>
    <p class="card-body">Inside the app, navigation keeps the SPA feel.</p>
    <div class="dot-list">
      <div class="dot-item">
        <span class="dot dot-green"></span>
        <span>Client-side navigation</span>
      </div>
      <div class="dot-item">
        <span class="dot dot-green"></span>
        <span>Fast and smooth SPA feel</span>
      </div>
    </div>
  </div>
</div>

<div class="callout callout-info" style="margin-top:24px">
  <p style="margin:0;font-size:1em">You can tune the SSR strategy per <span class="grad-purple">route</span> instead of committing to one global mode.</p>
</div>
