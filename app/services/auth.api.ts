import { createServerFn } from "@tanstack/start"
import { z } from "zod"
import { getSupabaseServerClient } from "~/lib/supabase"
import {
  SignUpSchema,
  SignInSchema,
  UserMetaSchema,
  AuthState,
} from "./auth.schema"

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
