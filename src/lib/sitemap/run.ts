// Simple CLI entrypoint to generate the sitemap.
// Usage: pnpm run sitemap
import { sitemap } from "./sitemap"
import { generateSitemap } from "./generate"
import { sql } from "~/lib/db"

async function main() {
  try {
    await generateSitemap(sitemap)
  } finally {
    await sql.end({ timeout: 5 })
  }
}

main().catch((err) => {
  console.error("Sitemap generation failed:", err)
  process.exit(1)
})
