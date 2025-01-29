export type ObjectKeysByValueType<T, U> = {
  [K in keyof T as Required<T>[K] extends U ? K : never]: T[K]
}
