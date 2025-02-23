import { Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Layout } from '~/components/layout'
import { CommunityList } from '~/components/community-list'

export const Route = createFileRoute('/communities/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Layout className="items-center gap-2">
      <h1 className="text-2xl font-bold">Communities</h1>
      <Suspense fallback="Loading communities...">
        <CommunityList />
      </Suspense>
    </Layout>
  )
}
