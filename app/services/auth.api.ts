import { createMiddleware, createServerFn, json } from "@tanstack/react-start"
import { getSupabaseServerClient } from "~/lib/supabase"
import {
  AuthState,
  SignInSchema,
  SignUpSchema,
  UserMetaSchema,
} from "./auth.schema"

export const userMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const supabase = getSupabaseServerClient()

    const { data } = await supabase.auth.getUser()

    return next({
      context: {
        user: data.user,
        supabase,
      },
    })
  },
)

const logMiddleware = createMiddleware({ type: "function" })
  .client(async ({ next }) => {
    console.log("Client middleware")

    return next({
      sendContext: {
        somethingPassedFromTheClient: { hello: "world" },
      },
    })
  })
  .server(async ({ next, context }) => {
    console.log(
      `I'm just logging something I received from the client: ${context.somethingPassedFromTheClient.hello}`,
    )

    return next({
      context: {
        theAnswer: 42 as const,
      },
    })
  })

export const userRequiredMiddleware = createMiddleware({ type: "function" })
  .middleware([logMiddleware, userMiddleware])
  .server(async ({ next, context }) => {
    if (!context.user) {
      throw json(
        { message: "You must be logged in to access this resource!" },
        { status: 401 },
      )
    }

    console.log("The answer is", context.theAnswer)

    return next({
      context: {
        user: context.user,
      },
    })
  })

export const signUp = createServerFn()
  .validator(SignUpSchema)
  .handler(async ({ data }) => {
    const { data: userData, error } =
      await getSupabaseServerClient().auth.signUp({
        email: data.email,
        password: data.password,
      })

    if (error) {
      switch (error.code) {
        case "email_exists":
          throw new Error("Email already exists")
        case "weak_password":
          throw new Error("Your password is too weak")
        default:
          throw new Error(error.message)
      }
    }

    if (userData.user) {
      return userData.user.id
    }

    throw new Error("Something went wrong")
  })

export const signIn = createServerFn()
  .validator(SignInSchema)
  .handler(async ({ data }) => {
    const { error } = await getSupabaseServerClient().auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      return { error: error.message }
    }
  })

export const signOut = createServerFn().handler(async () => {
  await getSupabaseServerClient().auth.signOut()
})

export const getUser = createServerFn()
  .middleware([userMiddleware])
  .handler<AuthState>(async ({ context: { user } }) => {
    if (!user) {
      return { isAuthenticated: false }
    }

    return {
      isAuthenticated: true,
      user: {
        email: user.email,
        meta: { username: user.user_metadata.username },
      },
    }
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

export const globalLoggerMiddleware = createMiddleware({
  type: "function",
}).server(async ({ next }) => {
  // console.log("Global middleware")
  return next()
})
