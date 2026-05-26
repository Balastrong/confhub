export function readDemoSecret() {
  return process.env.SECRET_KEY
}

// If this module is imported from client or shared UI code, TanStack Start blocks it:
//
// [import-protection] Import denied in client environment
//
//   Denied by file pattern: **/*.server.*
//   Importer: src/components/theme-selector.tsx:2:32
//   Import: "~/services/demo/import-protection.server"
//   Resolved: src/services/demo/import-protection.server.ts
//
// Keep server-only code in .server.ts files, or expose it through a server function.
