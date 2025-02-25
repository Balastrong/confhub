import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function getColorFromName(name: string) {
  const colors = [
    "bg-red-400",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-green-400",
    "bg-teal-400",
    "bg-blue-400",
    "bg-indigo-400",
    "bg-purple-400",
    "bg-pink-400",
    "bg-lime-400",
    "bg-emerald-400",
    "bg-cyan-400",
    "bg-sky-400",
    "bg-violet-400",
    "bg-fuchsia-400",
    "bg-rose-400",
    "bg-amber-400",
    "bg-green-300",
    "bg-blue-300",
    "bg-purple-300",
  ]

  let index = 0
  if (name.length > 0) {
    let code = 0
    for (let i = 0; i < 3 && i < name.length; i++) {
      code += name.charCodeAt(i) + name.charCodeAt(name.length - 1 - i)
    }

    index = code + name.length
  }

  return colors[index % colors.length]
}

export function getFirstSunday(year: number, month: number): Date {
  const firstDayOfMonth = new Date(year, month - 1, 1)
  const dayOfWeek = firstDayOfMonth.getDay() // 0 (Sunday) to 6 (Saturday)

  let diff = 0
  if (dayOfWeek !== 0) {
    diff = -dayOfWeek
  }

  const firstSunday = new Date(year, month - 1, 1 + diff)
  return firstSunday
}

export function getLastSaturday(year: number, month: number): Date {
  const lastDayOfMonth = new Date(year, month, 0)
  const dayOfWeek = lastDayOfMonth.getDay() // 0 (Sunday) to 6 (Saturday)

  let diff = 6 - dayOfWeek

  const lastSaturday = new Date(
    year,
    month - 1,
    lastDayOfMonth.getDate() + diff,
  )
  return lastSaturday
}

export function getFirstAndLast(
  year: number,
  month: number,
): { firstSunday: Date; lastSaturday: Date } {
  const firstSunday = getFirstSunday(year, month)
  const lastSaturday = getLastSaturday(year, month)

  return { firstSunday, lastSaturday }
}
