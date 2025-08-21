/** Splits a path on `/` segments to detect if any segment is `$something`. */
type SplitPath<S extends string> = S extends `${infer Segment}/${infer Rest}`
  ? Segment | SplitPath<Rest>
  : S

/** If any segment starts with `$`, treat it as a param name. */
type ExtractParams<S extends string> = {
  [K in SplitPath<S> as K extends `$${infer Param}` ? Param : never]: string
}

/** Check if a route string has any `$` segments. */
type RouteIsDynamic<R extends string> = keyof ExtractParams<R> extends never
  ? false
  : true

/** Optional fields that any sitemap entry can have. */
export type CommonSitemapFields = {
  lastModified?: string | Date
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never"
  priority?: number
}

/**
 * A "static" route has no $params => it's either a single object
 * or a function returning that object (sync or async). The function
 * receives the route string (e.g. "/home").
 */
type StaticRouteEntry = CommonSitemapFields
export type StaticRouteValue<R extends string> =
  | StaticRouteEntry
  | ((route: R) => StaticRouteEntry | Promise<StaticRouteEntry>)

/**
 * A "dynamic" route has $params => it's either an array of objects
 * (each with a `path` field) or a function returning that array. The
 * function receives the route string (e.g. "/posts/$postId").
 */
export type DynamicRouteEntry = CommonSitemapFields & { path: string }
export type DynamicRouteValue<R extends string> =
  | DynamicRouteEntry[]
  | ((route: R) => DynamicRouteEntry[] | Promise<DynamicRouteEntry[]>)

/**
 * Pick which shape to use based on whether `R` is dynamic or static.
 */
type RouteValue<R extends string> =
  RouteIsDynamic<R> extends true ? DynamicRouteValue<R> : StaticRouteValue<R>

/**
 * Generic sitemap definition. The user passes in their
 * union of route strings as `T`. For each route in `T`,
 * the value is optional (meaning you can skip it).
 */
export type Sitemap<T extends string> = {
  /** The base URL of your site */
  siteUrl: string
  defaultChangeFreq?: CommonSitemapFields["changeFrequency"]
  defaultPriority?: CommonSitemapFields["priority"]
  /** An object with keys = route strings, values = route config. */
  routes: {
    [R in T]?: RouteValue<R>
  }
}
