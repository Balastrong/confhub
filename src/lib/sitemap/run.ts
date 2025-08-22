// Usage: pnpm run sitemap
import { sitemap } from "./sitemap"
import { generateSitemap } from "./generate"

async function main() {
  await generateSitemap(sitemap)
}

main().catch((err) => {
  console.error("Sitemap generation failed:", err)
  process.exit(1)
})
