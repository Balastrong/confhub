import { MutationCache, QueryClient } from "@tanstack/react-query"
import {
  createRouter as createTanStackRouter,
  ErrorComponent,
} from "@tanstack/react-router"
import { routerWithQueryClient } from "@tanstack/react-router-with-query"
import { toast } from "sonner"
import { ZodError } from "zod"
import { routeTree } from "./routeTree.gen"

export function createRouter() {
  const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        retry: 0,
        refetchOnWindowFocus: false,
      },
    },
    mutationCache: new MutationCache({
      onError: (error: unknown) => {
        if (error instanceof Error) {
          toast.error(error.message)
        } else if (typeof error === "string") {
          toast.error(error)
        }
      },
    }),
  })

  const router = routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      defaultPreload: "intent",
      defaultErrorComponent: ErrorComponent,
      defaultNotFoundComponent: () => "Not found!",
      context: { queryClient },
    }),
    queryClient,
  )

  return router
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
