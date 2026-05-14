import {
  createRouter as createTanStackRouter,
  ErrorComponent,
} from "@tanstack/react-router"
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query"
import { routeTree } from "./routeTree.gen"
import { createQueryClient } from "./lib/tanstack-query"
import "~/lib/i18n"
import { NotFoundComponent } from "./components/not-found"

export function getRouter() {
  const queryClient = createQueryClient()

  const router = createTanStackRouter({
    routeTree,
    defaultPreload: false,
    defaultErrorComponent: ErrorComponent,
    defaultNotFoundComponent: NotFoundComponent,
    context: { queryClient },
  })

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  })

  if (process.env.LOG_DEBUG) {
    router.subscribe("onBeforeLoad", console.log)
    router.subscribe("onBeforeNavigate", console.log)
    router.subscribe("onBeforeRouteMount", console.log)
    router.subscribe("onLoad", console.log)
    router.subscribe("onRendered", console.log)
    router.subscribe("onResolved", console.log)
  }

  return router
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
