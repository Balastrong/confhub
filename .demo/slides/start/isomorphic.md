---
theme: monomi
layout: section
---


# Everything is <span class="grad-orange">isomorphic</span> by default

---
layout: default
---

# What does <span class="grad-orange">isomorphic</span> mean here?

<div class="grid grid-3" style="margin-top:24px">
  <div class="card">
    <div class="card-header">
      <div class="icon icon-blue icon-lg">🔄</div>
      <h3>Universal code</h3>
    </div>
    <p class="card-body">Your code can run on <strong>both</strong> server and client seamlessly.</p>
  </div>

  <div class="card">
    <div class="card-header">
      <div class="icon icon-green icon-lg">🎯</div>
      <h3>Target one side</h3>
    </div>
    <p class="card-body">Opt into server-only or client-only when you need to.</p>
  </div>

  <div class="card">
    <div class="card-header">
      <div class="icon icon-purple icon-lg">⚙️</div>
      <h3>Flexible behavior</h3>
    </div>
    <p class="card-body">Keep one mental model while environments behave differently.</p>
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
