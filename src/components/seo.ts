export type OgType = "website" | "article" | "profile"

export interface SeoImage {
  url: string
  alt?: string
}

export interface SeoParams {
  title: string
  description?: string
  keywords?: string | string[]
  images?: Array<SeoImage | string>
  siteName?: string
  locale?: string
  type?: OgType
  robots?: string
  noindex?: boolean
  publishedTime?: Date | string
  modifiedTime?: Date | string
  twitter?: {
    site?: string
    creator?: string
    card?: "summary" | "summary_large_image"
  }
  descriptionMaxLength?: number
  disableTitleSuffix?: boolean
  titleTemplate?: string | ((base: string, site: string) => string)
  extra?: Array<React.MetaHTMLAttributes<HTMLMetaElement>>
}

const DEFAULTS = {
  siteName: "ConfHub",
  locale: "en_US",
  twitterSite: "@balastrong",
  twitterCreator: "@balastrong",
  titleTemplate: "%s - ConfHub",
  robots: "index,follow",
}

function iso(value?: Date | string) {
  if (!value) return undefined
  const d = value instanceof Date ? value : new Date(value)
  return !isNaN(d.valueOf()) ? d.toISOString() : undefined
}

function normalizeDescription(desc?: string, max?: number) {
  if (!desc) return undefined
  const clean = desc.replace(/\s+/g, " ").trim()
  if (!max || max <= 0) return clean
  return clean.length > max ? clean.slice(0, max - 1).trimEnd() + "…" : clean
}

function makeTitle(base: string, site: string, p: SeoParams): string {
  if (p.disableTitleSuffix) return base
  const tmpl = p.titleTemplate || DEFAULTS.titleTemplate
  if (typeof tmpl === "function") return tmpl(base, site)
  if (tmpl.includes("%s")) return tmpl.replace("%s", base)
  if (base.includes(site)) return base
  return `${base} | ${site}`
}

export function seo(
  params: SeoParams,
): React.DetailedHTMLProps<
  React.MetaHTMLAttributes<HTMLMetaElement>,
  HTMLMetaElement
>[] {
  const site = params.siteName || DEFAULTS.siteName
  const locale = params.locale || DEFAULTS.locale
  const title = makeTitle(params.title, site, params)
  const description = normalizeDescription(
    params.description,
    params.descriptionMaxLength ?? 160,
  )
  const keywords = Array.isArray(params.keywords)
    ? params.keywords.join(", ")
    : params.keywords
  const robots =
    params.robots || (params.noindex ? "noindex,nofollow" : DEFAULTS.robots)
  const images: SeoImage[] = (params.images || []).map((i) =>
    typeof i === "string" ? { url: i } : i,
  )
  const primary = images[0]
  const twitterCard =
    params.twitter?.card || (primary ? "summary_large_image" : "summary")
  const published = iso(params.publishedTime)
  const modified = iso(params.modifiedTime)
  const twitterSite = params.twitter?.site || DEFAULTS.twitterSite
  const twitterCreator = params.twitter?.creator || DEFAULTS.twitterCreator

  const meta: React.DetailedHTMLProps<
    React.MetaHTMLAttributes<HTMLMetaElement>,
    HTMLMetaElement
  >[] = []

  // Basic
  meta.push({ title })
  if (description) meta.push({ name: "description", content: description })
  if (keywords) meta.push({ name: "keywords", content: keywords })
  if (robots) meta.push({ name: "robots", content: robots })

  // OG
  meta.push({ property: "og:type", content: params.type || "website" })
  meta.push({ property: "og:title", content: title })
  if (description)
    meta.push({ property: "og:description", content: description })
  meta.push({ property: "og:site_name", content: site })
  meta.push({ property: "og:locale", content: locale })
  images.forEach((img) => {
    meta.push({ property: "og:image", content: img.url })
    if (img.alt) meta.push({ property: "og:image:alt", content: img.alt })
  })
  if (published)
    meta.push({ property: "article:published_time", content: published })
  if (modified)
    meta.push({ property: "article:modified_time", content: modified })

  // Twitter
  meta.push({ name: "twitter:card", content: twitterCard })
  meta.push({ name: "twitter:title", content: title })
  if (description)
    meta.push({ name: "twitter:description", content: description })
  if (twitterSite) meta.push({ name: "twitter:site", content: twitterSite })
  if (twitterCreator)
    meta.push({ name: "twitter:creator", content: twitterCreator })
  if (primary) {
    meta.push({ name: "twitter:image", content: primary.url })
    if (primary.alt)
      meta.push({ name: "twitter:image:alt", content: primary.alt })
  }

  if (params.extra) meta.push(...params.extra)

  // Dedupe by name/property
  const seen = new Set<string>()
  return meta.filter((m) => {
    if (!m) return false
    const key =
      (m.name ? `n:${m.name}` : "") + (m.property ? `p:${m.property}` : "")
    if (!key) return true
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
