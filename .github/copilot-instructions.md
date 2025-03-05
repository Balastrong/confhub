# ConfHub - Development Instructions

This is a TanStack Start project for a conference hub application. Follow these guidelines when developing for this project.

## Project Architecture

- **Routing**: Uses `@tanstack/react-router`. Route files are in the `/routes` folder. Root layout is in `__root.tsx`.
- **API Structure**: Server functions are created with `createServerFn()` from `@tanstack/start`.
- **Database**: Supabase is used as the backend database service.
- **State Management**: TanStack Query is used for data fetching, caching, and state management.

## Technology Stack

- **Framework**: TanStack Start + React
- **Routing**: `@tanstack/react-router`
- **Database**: Supabase via `supabase-js` client
- **UI Components**: shadcn/ui component library
- **Forms**: TanStack Form with the custom `useAppForm` hook
- **API**: Server functions with `createServerFn()` from `@tanstack/start`
- **Styling**: Tailwind CSS

## Code Organization

- `/app/routes/` - All route components
- `/app/components/` - Reusable React components
- `/app/services/` - API service functions organized by domain (auth, events, etc.)
- `/app/lib/` - Utility functions and configurations
- `/app/components/ui/` - shadcn/ui components

## Database Access

When accessing Supabase:

- Use `getSupabaseServerClient()` from `~/lib/supabase` for server-side operations
- Strongly typed with generated types from `~/lib/types.gen.ts`
- Handle errors appropriately with `.throwOnError()` or explicit error handling

## Development Patterns

### API Service Pattern

```typescript
import { createServerFn } from "@tanstack/start"
import { getSupabaseServerClient } from "~/lib/supabase"
import { YourValidationSchema } from "./your-schema"

export const yourServiceFunction = createServerFn()
  .validator(YourValidationSchema) // Use zod for validation
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    // Implement your database logic here
  })
```

### Form Management

```typescript
import { useAppForm } from "~/lib/form"
import { yourSchema } from "~/services/your-schema"

function YourComponent() {
  const form = useAppForm({
    schema: yourSchema,
    defaultValues: {},
    onSubmit: async (values) => {
      // Handle form submission
    },
  })

  // Use form.register, form.formState, etc.
}
```

### Routes and Navigation

```typescript
import { createFileRoute, useNavigate } from "@tanstack/react-router"

export const Route = createFileRoute("/your-path/")({
  beforeLoad: ({ context }) => {
    // Pre-load data if needed
    context.queryClient.ensureQueryData(yourQueries.list())
  },
  component: YourComponent,
})

function YourComponent() {
  const navigate = useNavigate()
  // Component implementation
}
```

## Error Handling

- Use toast notifications for user-facing errors
- Handle zod validation errors appropriately
- Use error boundaries for component-level error handling

## Environment Variables

Key environment variables:

- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
