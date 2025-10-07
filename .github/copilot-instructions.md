## ConfHub – Copilot Developer Guide

This document encodes the conventions used in ConfHub so AI/code-gen stays aligned with our architecture. Favor the patterns below when adding features or refactors.

## Stack and Architecture

- Framework: TanStack Start + React (file-based routing)
- Routing: @tanstack/react-router with router context and beforeLoad data prefetching
- Data: TanStack Query for fetching/caching, with a single shared QueryClient wired into the router
- Server APIs: createServerFn from @tanstack/react-start (+ middleware) and Drizzle ORM for DB access
- Forms: TanStack Form via a custom createFormHook exported as useAppForm
- UI: shadcn/ui + Tailwind; icons via lucide-react
- i18n: i18next with cookie-based language detection and SSR language setup

Project layout (non-exhaustive):

- src/routes: Route files. Root route is routes/\_\_root.tsx
- src/services: Domain modules: _.api.ts (server functions), _.schema.ts (Zod), queries.ts (React Query options + mutations)
- src/components: UI and domain components
- src/lib: Utilities (date, i18n, form, event-modes, etc.) and app config
- .github/instructions: Task-specific instruction files used by tooling (see import-event.instructions.md)

TypeScript: strict mode, path alias ~/_ -> src/_ (see tsconfig.json). Prefer named exports.

## Router and Data Prefetching (TanStack Start + Router)

- Router is created in src/router.tsx and enhanced with routerWithQueryClient. DefaultQuery options:
  - staleTime ~5 minutes, retry 0, refetchOnWindowFocus false
  - MutationCache shows toast errors globally; set meta: { disableGlobalErrorHandling: true } on mutations when you handle errors yourself
- In routes, prefetch data in beforeLoad using context.queryClient.ensureQueryData(...). Example:

```ts
export const Route = createFileRoute("/")({
  beforeLoad: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(tagQueries.list()),
      context.queryClient.ensureQueryData(countryQueries.list()),
    ])
  },
  validateSearch: EventFiltersSchema,
  component: Home,
})
```

- Use validateSearch with Zod schemas for route search params. Access them via Route.useSearch() or getRouteApi(path).useSearch().
- When language changes, the app invalidates the router (see routes/\_\_root.tsx + lib/i18n.ts). Do not bypass router.invalidate for language-driven re-renders.

## Server Functions (TanStack Start) and DB

- Place domain server functions in src/services/<domain>.api.ts.
- Create APIs with createServerFn(). Chain helpers for validation and auth:
  - inputValidator(ZodSchema) to validate incoming payloads
  - middleware([userMiddleware | userRequiredMiddleware]) to pass userSession and enforce auth
  - handler(async ({ data, context }) => { ... }) returns JSON-serializable values
- Use Drizzle for DB access (see src/services/event.api.ts for patterns). Prefer composing Drizzle expressions and returning lean records.
- For HTTP-like errors use json({ message }, { status }) from @tanstack/react-start to propagate status codes. For validation errors, rely on inputValidator; the global mutation error handler will render Zod messages via sonner toasts.
- Prefer generating slugs/derived fields on the server (see upsertEvent) and enforcing authorization with middleware.

Auth middleware patterns:

```ts
export const userMiddleware = createMiddleware().server(async ({ next }) => {
  const userSession = await getUserSession()
  return next({ context: { userSession } })
})

export const userRequiredMiddleware = createMiddleware()
  .middleware([userMiddleware])
  .server(async ({ next, context }) => {
    if (!context.userSession)
      throw json(
        { message: "You must be logged in to do that!" },
        { status: 401 },
      )
    return next({ context: { userSession: context.userSession } })
  })
```

## TanStack Query – Queries and Mutations

- Centralize query keys and options in src/services/queries.ts. Use queryOptions to define queries and export small helpers per domain:

```ts
export const eventQueries = {
  all: ["events"],
  list: (filters: EventFilters) =>
    queryOptions({
      queryKey: ["events", "list", filters],
      queryFn: () => getEvents({ data: filters }),
    }),
  detail: (eventId: number) =>
    queryOptions({
      queryKey: ["events", "detail", eventId],
      queryFn: () => getEvent({ data: { id: eventId } }),
      enabled: !isNaN(eventId) && !!eventId,
    }),
}
```

- Prefer useSuspenseQuery for data preloaded in beforeLoad; otherwise use useQuery. Example usage in components:

```tsx
const { data } = useSuspenseQuery(eventQueries.list(filters))
```

- Mutations live next to queries in queries.ts. Invalidate specific keys on success rather than the entire cache:

```ts
export const useUpsertEventMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: upsertEvent,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: eventQueries.all }),
  })
}
```

- Use enabled guards on queries depending on IDs/slugs to prevent unnecessary calls. Set contextual staleTime where useful.
- Error handling: Global MutationCache toasts errors and formats Zod issues. To override, pass meta: { disableGlobalErrorHandling: true } in the mutation options and handle errors locally.

## Forms – useAppForm (TanStack Form)

- The app exports a typed form hook in src/lib/form.ts via createFormHook. It wires:
  - Field components: TextField, SelectField
  - Form components: SubmitButton
  - Contexts: fieldContext, formContext
- Typical usage:

```tsx
const form = useAppForm<YourValues>({
  defaultValues: { ... },
  validators: { onMount: YourZodSchema, onSubmit: YourZodSchema },
  onSubmitInvalid: (errors) => console.log(errors),
  onSubmit: async ({ value }) => { await mutate({ data: value }) },
})

return (
  <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
    <form.AppField name="name">{(field) => <field.TextField label="Name" required />}</form.AppField>
    <form.AppForm>
      <form.SubmitButton label="Save" />
    </form.AppForm>
  </form>
)
```

- Use form.Field when you need custom render logic; use form.AppField to leverage pre-wired field components. Always update values via field.handleChange / setValue to keep form state in sync.
- When mixing auth-only settings in forms, gate with <SignedIn> / <SignedOut> components.

## i18n

- i18next is initialized in src/lib/i18n.ts with cookie detection (i18nextLng). On the server, setSSRLanguage reads the cookie and updates language during beforeLoad in \_\_root.tsx.
- When language changes on the client, we call router.invalidate to re-run loaders and update the UI.
- Add new translations in src/locales/<lang>.json and keep keys stable.

## UI and UX

- Use shadcn/ui components from src/components/ui. Prefer consistent visual patterns (cards, labels, inputs, skeletons). Icons come from lucide-react.
- For loading states, prefer React.Suspense + skeleton components when routes prefetch; otherwise use isLoading flags.
- User-facing errors are shown via sonner toasts. Keep messages succinct and actionable.

## Adding a New Feature – Checklist

1. Model and validation
   - Create/update Zod schemas in src/services/<domain>.schema.ts
2. Server functions
   - Implement createServerFn handlers in src/services/<domain>.api.ts
   - Add inputValidator and proper auth middleware when needed
3. Queries and mutations
   - Define queryOptions and mutation hooks in src/services/queries.ts
   - Use targeted cache invalidation
4. Routing
   - Create route with createFileRoute
   - Prefetch with context.queryClient.ensureQueryData(...) in beforeLoad
   - Validate search with Zod schemas
5. UI & Forms
   - Build UI with shadcn components; compose forms with useAppForm
6. i18n
   - Add/adjust translation strings if UI is user-facing

## Patterns to Reuse (concrete examples)

- Prefetch + Suspense list: see routes/index.tsx + components/event/events-list.tsx
- Mutations with invalidation: see useUpsertEventMutation, useUpsertRsvpMutation
- Threaded comments with optimistic UX: see components/event/comments.tsx
- Authorization checks in server: see upsertEvent in src/services/event.api.ts

## Task-Specific Instructions Files

- Some automated tasks rely on .github/instructions/\*.instructions.md. For example, import-event.instructions.md applies to data-entry/data.json and defines how to scrape/append events. When working on files covered by these instructions, follow them precisely.

## Coding Conventions

- Imports: use path alias ~/\* for src imports; avoid deep relative paths
- Exports: prefer named exports; colocate domain-specific code by folder
- Types: keep return types explicit on server functions and exported helpers
- Dates: use helpers in src/lib/date.ts (formatDate, formatDateTime)
- Event modes: use helpers in src/lib/event-modes.tsx and the EventModes list from schemas

## Error Handling Best Practices

- Prefer throwing json({ message }, { status }) for HTTP errors inside server functions
- Let inputValidator handle Zod validation; avoid custom try/catch unless you add context
- Client mutations: rely on global toasts by default; set meta.disableGlobalErrorHandling to take over manually
- Route-level error boundaries are already used in some places—wrap expensive components with ErrorBoundary when needed

## Performance Notes

- Use ensureQueryData in beforeLoad to warm caches and enable useSuspenseQuery
- Add enabled guards to queries that depend on IDs/slugs; set contextual staleTime where appropriate
- Avoid broad cache invalidation; target the smallest relevant keys

## Security Notes

- Put privileged logic in server functions only; never trust client-provided IDs
- Use userRequiredMiddleware for write operations and cross-check entity ownership on the server
- For rate limiting or server-only logic, prefer createServerOnlyFn from @tanstack/react-start (see services/rate-limit.guard.ts)

## When in Doubt

- Look for an existing pattern in src/services/queries.ts, server .api.ts files, and related route/components, then mirror it
- Keep UI accessible (labels, aria, keyboard) and translations up to date
- Prefer smaller, composable helpers over monolithic modules

—
This guide reflects current practices in the codebase. If you improve a pattern, update this file with the new recommendation so Copilot keeps generating code the way we want.
