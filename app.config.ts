import { defineConfig } from "@tanstack/start/config";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  vite: {
    plugins: [
      tsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
    ],
  },
  server: {
    preset: "netlify",
    compatibilityDate: "2025-01-02",
  },
});
