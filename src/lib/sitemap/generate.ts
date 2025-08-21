// Originally taken from https://github.com/Ryanjso/tanstack-router-sitemap

import { createWriteStream } from "fs"
import path from "path"
import { SitemapStream, streamToPromise } from "sitemap"
import { CommonSitemapFields, Sitemap } from "./sitemap-types"

// A small interface for final flattened entries.
interface FinalSitemapEntry {
  url: string // e.g. https://example.com/home or https://example.com/posts/123
  lastmod?: string // e.g. 2025-01-15
  changefreq?: string // "daily", "weekly", etc.
  priority?: number // e.g. 0.8
}

// export function generateSitemapPlugin<T extends string>(sitemap: Sitemap<T>) {
//   return {
//     name: "tanstack-router-sitemap",
//     apply: "build" as const,
//     closeBundle: async () => {
//       await generateSitemap(sitemap)
//     },
//   }
// }

export async function generateSitemap<T extends string>(sitemap: Sitemap<T>) {
  console.log("Generating sitemap...")
  const startTime = Date.now()
  const finalEntries: FinalSitemapEntry[] = []

  const {
    siteUrl,
    routes,
    defaultPriority = 0.5,
    defaultChangeFreq = "weekly",
  } = sitemap

  const createEntry = (path: string, entry: CommonSitemapFields) => {
    return {
      url: `${siteUrl}${path}`,
      lastmod:
        entry.lastModified instanceof Date
          ? entry.lastModified.toISOString()
          : entry.lastModified,
      changefreq: entry.changeFrequency || defaultChangeFreq,
      priority: entry.priority || defaultPriority,
    }
  }

  for (const route in routes) {
    const routeValue = routes[route]

    if (typeof routeValue === "function") {
      const resolvedValue = await routeValue(route)
      if (Array.isArray(resolvedValue)) {
        finalEntries.push(
          ...resolvedValue.map((entry) => createEntry(entry.path, entry)),
        )
      } else {
        finalEntries.push(createEntry(route, resolvedValue))
      }
    } else if (Array.isArray(routeValue)) {
      finalEntries.push(
        ...routeValue.map((entry) => createEntry(entry.path, entry)),
      )
    } else if (typeof routeValue === "object" && routeValue !== null) {
      finalEntries.push(createEntry(route, routeValue))
    } else if (routeValue === null) {
      // Skip this route
    } else {
      throw new Error(`Invalid route value for route: ${route}`)
    }
  }

  // Dynamically resolve the path to the public folder
  const outputFile = path.resolve(process.cwd(), "public", "sitemap.xml")

  const writeStream = createWriteStream(outputFile)
  const sitemapStream = new SitemapStream({ hostname: siteUrl })

  sitemapStream.pipe(writeStream)

  try {
    // Write all links to the sitemap stream
    finalEntries.forEach((entries) => {
      sitemapStream.write(entries)
    })

    // End the stream and wait for completion
    sitemapStream.end()

    await streamToPromise(sitemapStream)

    const endTime = Date.now()
    const seconds = (endTime - startTime) / 1000

    console.log(
      `Generated sitemap with ${finalEntries.length} entries in ${seconds}s`,
    )
  } catch (error) {
    console.error("Error generating sitemap:", error)
  }
}
