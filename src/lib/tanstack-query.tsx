import {
  environmentManager,
  MutationCache,
  QueryClient,
} from "@tanstack/react-query"
import { toast } from "sonner"
import { ZodError } from "zod"
import { fromError } from "zod-validation-error"

function parseZodError(error: Error) {
  try {
    return new ZodError(JSON.parse(error.message))
  } catch {}
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        retry: 0,
        refetchOnWindowFocus: false,
      },
    },
    mutationCache: new MutationCache({
      onError: (error: unknown, _1, _2, mutation) => {
        if (mutation?.meta?.disableGlobalErrorHandling) return

        if (error instanceof Error) {
          const zodError = parseZodError(error)
          if (zodError) {
            toast.error(fromError(zodError, { maxIssuesInMessage: 2 }).message)
            return
          }

          toast.error(error.message)
        } else if (typeof error === "string") {
          toast.error(error)
        } else if (
          typeof error === "object" &&
          error !== null &&
          "message" in error
        ) {
          toast.error((error as { message: string }).message)
        }
      },
    }),
  })
}

let browserQueryClient: QueryClient | undefined

export function createQueryClient() {
  if (environmentManager.isServer()) {
    return makeQueryClient()
  }

  browserQueryClient ??= makeQueryClient()

  return browserQueryClient
}
