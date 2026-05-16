---
theme: monomi
layout: section
---


# Server Functions work by exposing <span class="grad-orange">HTTP endpoints</span>

## You might want to protect them with <span class="grad-red">authentication</span>

---
layout: section
---

# <span class="grad-purple">Middlewares</span>

## Run logic before/after a server function or route

---
layout: default
---

# Middleware use cases

<div class="grid grid-2" style="margin-top:20px">
  <div class="card">
    <div class="card-header">
      <div class="icon icon-red">🔐</div>
      <h3>Authentication</h3>
    </div>
    <p class="card-body">Protect routes and verify user identity.</p>
  </div>

  <div class="card">
    <div class="card-header">
      <div class="icon icon-blue">📊</div>
      <h3>Observability</h3>
    </div>
    <p class="card-body">Log, measure, and trace what happens.</p>
  </div>

  <div class="card">
    <div class="card-header">
      <div class="icon icon-green">🔗</div>
      <h3>Context provider</h3>
    </div>
    <p class="card-body">Inject shared data and request-scoped dependencies.</p>
  </div>

  <div class="card">
    <div class="card-header">
      <div class="icon icon-yellow">⚠️</div>
      <h3>Error handling</h3>
    </div>
    <p class="card-body">Keep failures consistent across routes and functions.</p>
  </div>
</div>

---
layout: default
---

# Middleware features

<div class="grid grid-2" style="margin-top:20px">
  <div class="card">
    <div class="card-header">
      <div class="icon icon-purple">🔗</div>
      <h3>Chainable</h3>
    </div>
    <p class="card-body">Compose small pieces into a single request pipeline.</p>
  </div>

  <div class="card">
    <div class="card-header">
      <div class="icon icon-red">🛑</div>
      <h3>Request control</h3>
    </div>
    <p class="card-body">Abort early when a request should not continue.</p>
  </div>

  <div class="card">
    <div class="card-header">
      <div class="icon icon-blue">✏️</div>
      <h3>Data modification</h3>
    </div>
    <p class="card-body">Rewrite request or response data on the way through.</p>
  </div>

  <div class="card">
    <div class="card-header">
      <div class="icon icon-green">⚡</div>
      <h3>Universal hooks</h3>
    </div>
    <p class="card-body">Run before or after handlers (client & server).</p>
  </div>
</div>
