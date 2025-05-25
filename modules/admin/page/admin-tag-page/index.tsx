import { getAllTags } from '@/actions/tags'
import Loading from '@/components/shared/loading'
import { Suspense } from 'react'
import TagListTable from './internal/tag-list-table'
import TagSearch from './internal/tag-search'

export default async function AdminTagPage() {
  const tags = getAllTags()

  return (
    <main className="w-full flex flex-col gap-2">
      <TagSearch />
      <Suspense fallback={<Loading />}>
        <TagListTable initialDataPromise={tags} />
      </Suspense>
    </main>
  )
}
