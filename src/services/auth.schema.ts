import { z } from "zod"

export const UserMetaSchema = z.object({
  username: z.string().min(3).max(20),
})

export type UserMeta = z.infer<typeof UserMetaSchema>

// TODO: Refine password === confirmPassword
export const SignUpSchema = z.object({
  username: UserMetaSchema.shape.username,
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string(),
})

export type SignUpSchema = z.infer<typeof SignUpSchema>

export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export type SignInSchema = z.infer<typeof SignInSchema>
