import { createServerFileRoute } from "@tanstack/react-start/server"

export const ServerRoute = createServerFileRoute("/sitemap.xml").methods({
  GET: ({ request }) => {
    console.log("Fresh")
    const { origin } = new URL(request.url)

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${origin}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`

    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=100",
        "Netlify-CDN-Cache-Control": "public, max-age=100",
        "Surrogate-Control": "public, max-age=100",
      },
    })
  },
})
