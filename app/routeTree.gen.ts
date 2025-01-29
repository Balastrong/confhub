/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from "./routes/__root"
import { Route as TestImport } from "./routes/test"
import { Route as SignUpImport } from "./routes/sign-up"
import { Route as SignInImport } from "./routes/sign-in"
import { Route as IndexImport } from "./routes/index"

// Create/Update Routes

const TestRoute = TestImport.update({
  id: "/test",
  path: "/test",
  getParentRoute: () => rootRoute,
} as any)

const SignUpRoute = SignUpImport.update({
  id: "/sign-up",
  path: "/sign-up",
  getParentRoute: () => rootRoute,
} as any)

const SignInRoute = SignInImport.update({
  id: "/sign-in",
  path: "/sign-in",
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: "/",
  path: "/",
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/": {
      id: "/"
      path: "/"
      fullPath: "/"
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    "/sign-in": {
      id: "/sign-in"
      path: "/sign-in"
      fullPath: "/sign-in"
      preLoaderRoute: typeof SignInImport
      parentRoute: typeof rootRoute
    }
    "/sign-up": {
      id: "/sign-up"
      path: "/sign-up"
      fullPath: "/sign-up"
      preLoaderRoute: typeof SignUpImport
      parentRoute: typeof rootRoute
    }
    "/test": {
      id: "/test"
      path: "/test"
      fullPath: "/test"
      preLoaderRoute: typeof TestImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  "/": typeof IndexRoute
  "/sign-in": typeof SignInRoute
  "/sign-up": typeof SignUpRoute
  "/test": typeof TestRoute
}

export interface FileRoutesByTo {
  "/": typeof IndexRoute
  "/sign-in": typeof SignInRoute
  "/sign-up": typeof SignUpRoute
  "/test": typeof TestRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  "/": typeof IndexRoute
  "/sign-in": typeof SignInRoute
  "/sign-up": typeof SignUpRoute
  "/test": typeof TestRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: "/" | "/sign-in" | "/sign-up" | "/test"
  fileRoutesByTo: FileRoutesByTo
  to: "/" | "/sign-in" | "/sign-up" | "/test"
  id: "__root__" | "/" | "/sign-in" | "/sign-up" | "/test"
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  SignInRoute: typeof SignInRoute
  SignUpRoute: typeof SignUpRoute
  TestRoute: typeof TestRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  SignInRoute: SignInRoute,
  SignUpRoute: SignUpRoute,
  TestRoute: TestRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/sign-in",
        "/sign-up",
        "/test"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/sign-in": {
      "filePath": "sign-in.tsx"
    },
    "/sign-up": {
      "filePath": "sign-up.tsx"
    },
    "/test": {
      "filePath": "test.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
