---
theme: monomi
layout: section
---


# Server Functions

## A special implementation of an isomorphic function

---
layout: default
---

# A Server Function

<div class="grid grid-3" style="margin-top:20px">
  <div class="card">
    <div class="card-header">
      <div class="icon icon-red">🖥️</div>
      <h3>Server-only execution</h3>
    </div>
    <p class="card-body">Runs only on the server, code never reaches the client bundle.</p>
  </div>

  <div class="card">
    <div class="card-header">
      <div class="icon icon-blue">🌐</div>
      <h3>Generated endpoint</h3>
    </div>
    <p class="card-body">Automatically creates an HTTP endpoint for client access.</p>
  </div>


  <div class="card">
    <div class="card-header">
      <div class="icon icon-yellow">🔒</div>
      <h3>Security first</h3>
    </div>
    <p class="card-body">A natural place for secrets and database access.</p>
  </div>
</div>

<div class="callout callout-tip" style="margin-top:24px">
  <p style="margin:0;font-size:1em"><strong>Server:</strong> run the function directly. <strong>Client:</strong> transparently becomes a fetch to the generated endpoint.</p>
</div>
