---
theme: monomi
layout: default
---

# A Server Function:

- Runs only on the server (it's extracted from the client bundle)
- Can be called from the client or server
  - A simple async function from the server
  - An HTTP endpoint hit with a fetch from the client
- Has a public URL (unstable... for now!)
- Has full control on HTTP response, headers, cookies, redirects, etc.