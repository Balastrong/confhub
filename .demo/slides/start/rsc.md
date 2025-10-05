---
theme: default
layout: section
---

# What about React Server Components (RSC)?

---
layout: default
---

```tsx
export async function ServerComp({ children }) {
  // Do some async server stuff here
  return <div>{children}</div>
}

const getServerComp = createServerFn().handler(async () => ({ children: JSX }) => {
  return <ServerComp>{children}</ServerComp>
})

function Main() {
  const ServerComponent = use(getServerComp())

  return <ServerComponent><div>Hello</div></ServerComponent>
}
```