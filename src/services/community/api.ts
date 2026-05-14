import { createServerFn } from "@tanstack/react-start"
import { setResponseStatus } from "@tanstack/react-start/server"
import { z } from "zod"
import { userMiddleware, userRequiredMiddleware } from "~/services/auth/api"
import {
  CommunityFiltersSchema,
  CreateCommunitySchema,
  JoinCommunitySchema,
  UpdateCommunitySchema,
} from "./schema"
import { communityService } from "./service.server"

export const createCommunity = createServerFn({ method: "POST" })
  .inputValidator(CreateCommunitySchema)
  .middleware([userRequiredMiddleware])
  .handler(async ({ data, context: { userSession } }) => {
    return communityService.createCommunity(userSession.user.id, data)
  })

export const getCommunities = createServerFn({ method: "GET" })
  .inputValidator(CommunityFiltersSchema)
  .middleware([userMiddleware])
  .handler(async ({ data, context: { userSession } }) => {
    return communityService.getCommunities(data, userSession?.user?.id)
  })

export const getCommunity = createServerFn({ method: "GET" })
  .inputValidator(
    z
      .object({ id: z.number().optional(), slug: z.string().optional() })
      .refine((data) => data.id !== undefined || data.slug !== undefined, {
        message: "Either id or slug must be provided",
      }),
  )
  .middleware([userMiddleware])
  .handler(async ({ data, context: { userSession } }) => {
    return communityService.getCommunity(data, userSession?.user?.id)
  })

export const getCommunityBySlug = createServerFn({ method: "GET" })
  .inputValidator(z.object({ slug: z.string() }))
  .middleware([userMiddleware])
  .handler(async ({ data, context: { userSession } }) => {
    return communityService.getCommunity(
      { slug: data.slug },
      userSession?.user?.id,
    )
  })

export const joinCommunity = createServerFn({ method: "POST" })
  .inputValidator(JoinCommunitySchema)
  .middleware([userRequiredMiddleware])
  .handler(async ({ data, context: { userSession } }) => {
    await communityService.joinCommunity(userSession.user.id, data.communityId)
  })

export const leaveCommunity = createServerFn({ method: "POST" })
  .inputValidator(JoinCommunitySchema)
  .middleware([userRequiredMiddleware])
  .handler(async ({ data, context: { userSession } }) => {
    await communityService.leaveCommunity(userSession.user.id, data.communityId)
  })

export const updateCommunity = createServerFn({ method: "POST" })
  .inputValidator(UpdateCommunitySchema)
  .middleware([userRequiredMiddleware])
  .handler(async ({ data, context: { userSession } }) => {
    return communityService.updateCommunity(userSession.user.id, data)
  })

export const getUserRoleInCommunity = createServerFn({ method: "GET" })
  .inputValidator(z.object({ communityId: z.number() }))
  .middleware([userRequiredMiddleware])
  .handler(async ({ data, context: { userSession } }) => {
    const role = await communityService.getUserRoleInCommunity(
      userSession.user.id,
      data.communityId,
    )

    if (!role) {
      setResponseStatus(404)
      return null
    }

    return role
  })
