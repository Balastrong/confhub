import { createServerFn } from "@tanstack/start"
import { getSupabaseServerClient } from "~/lib/supabase"
import {
  CreateCommunitySchema,
  JoinCommunitySchema,
  UpdateCommunitySchema,
} from "./community.schema"
import { z } from "zod"

export const createCommunity = createServerFn()
  .validator(CreateCommunitySchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()

    const { data: community, error } = await supabase
      .from("communities")
      .insert(data)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return community
  })

export const getCommunities = createServerFn().handler(async () => {
  const supabase = getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from("communities")
    .select("*, user_community(userId)")
    .order("name")

  if (error) {
    throw new Error(error.message)
  }

  return data.map((community) => {
    const isMember = community.user_community.some(
      (userCommunity) => userCommunity.userId === user?.id,
    )

    const { user_community, ...rest } = community

    return { ...rest, isMember }
  })
})

export const getCommunity = createServerFn()
  .validator(z.object({ id: z.number() }))
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { data: community, error } = await supabase
      .from("communities")
      .select("*, user_community(userId)")
      .eq("id", data.id)
      .single()

    if (error) {
      throw new Error(error.message)
    }

    const isMember = community.user_community.some(
      (userCommunity) => userCommunity.userId === user?.id,
    )

    const { user_community, ...rest } = community

    return { ...rest, isMember }
  })

export const joinCommunity = createServerFn()
  .validator(JoinCommunitySchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("User not found")
    }

    const { error } = await supabase.from("user_community").insert({
      userId: user?.id,
      communityId: data.communityId,
    })

    if (error) {
      throw new Error(error.message)
    }

    return { success: true }
  })

export const leaveCommunity = createServerFn()
  .validator(JoinCommunitySchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("User not found")
    }

    const { error } = await supabase
      .from("user_community")
      .delete()
      .eq("userId", user.id)
      .eq("communityId", data.communityId)

    if (error) {
      throw new Error(error.message)
    }

    return { success: true }
  })

export const updateCommunity = createServerFn()
  .validator(UpdateCommunitySchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()

    const { id, ...community } = data

    console.log(data)

    const { data: updatedCommunity, error } = await supabase
      .from("communities")
      .update(community)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return updatedCommunity
  })
