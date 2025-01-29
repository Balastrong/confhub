import { createServerFn } from "@tanstack/start"
import { z } from "zod"
import { getSupabaseServerClient, User } from "~/lib/supabase"

// TODO: Refine password === confirmPassword
const SignUpSchema = z.object({
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

export const getUser = createServerFn().handler<AuthState>(async () => {
  const supabase = getSupabaseServerClient()

  const { data } = await supabase.auth.getUser()

  if (data.user) {
    return {
      isAuthenticated: true,
      user: { email: data.user.email },
    }
  }

  return { isAuthenticated: false }
})
