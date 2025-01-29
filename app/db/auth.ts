import { createServerFn } from "@tanstack/start"
import { z } from "zod"
import { getSupabaseServerClient } from "~/lib/supabase"

const UserMetaSchema = z.object({
  username: z.string().min(3).max(20),
})

// TODO: Refine password === confirmPassword
const SignUpSchema = z.object({
  username: UserMetaSchema.shape.username,
  email: z.string().email(),
  password: z.string(),
  confirmPassword: z.string(),
})

export const signUp = createServerFn()
  .validator(SignUpSchema)
  .handler(async ({ data }) => {
    const { data: user, error } = await getSupabaseServerClient().auth.signUp({
      email: data.email,
      password: data.password,
    })

    if (error) {
      throw new Error(error.message)
    }

    if (user.user) {
      return user.user.id
    }

    throw new Error("Something went wrong")
  })

const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export const signIn = createServerFn()
  .validator(SignInSchema)
  .handler(async ({ data }) => {
    const { data: user, error } =
      await getSupabaseServerClient().auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

    if (error) {
      throw new Error(error.message)
    }

    if (user.user) {
      return user.user.id
    }
  })

export const signOut = createServerFn().handler(async () => {
  await getSupabaseServerClient().auth.signOut()
})

export type AuthState =
  | {
      isAuthenticated: false
    }
  | {
      isAuthenticated: true
      user: User
    }

export const updateUser = createServerFn()
  .validator(UserMetaSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()

    const { error } = await supabase.auth.updateUser({
      data: { username: data.username },
    })

    if (error) {
      throw new Error(error.message)
    }
  })

export type UserMeta = z.infer<typeof UserMetaSchema>

export type User = { email?: string; meta: UserMeta }

export const getUser = createServerFn().handler<AuthState>(async () => {
  const supabase = getSupabaseServerClient()

  const { data } = await supabase.auth.getUser()

  if (data.user) {
    return {
      isAuthenticated: true,
      user: {
        email: data.user.email,
        meta: { username: data.user.user_metadata.username },
      },
    }
  }

  return { isAuthenticated: false }
})
