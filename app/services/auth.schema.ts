import { createServerFn } from "@tanstack/start"
import { z } from "zod"
import { getSupabaseServerClient } from "~/lib/supabase"

export const UserMetaSchema = z.object({
  username: z.string().min(3).max(20),
})

export type UserMeta = z.infer<typeof UserMetaSchema>

// TODO: Refine password === confirmPassword
export const SignUpSchema = z.object({
  username: UserMetaSchema.shape.username,
  email: z.string().email(),
  password: z.string(),
  confirmPassword: z.string(),
})

export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export type AuthState =
  | {
      isAuthenticated: false
    }
  | {
      isAuthenticated: true
      user: User
    }

export type User = { email?: string; meta: UserMeta }
