import Loading from '@/components/shared/loading'
import { fetchAllTagsPromise } from '@/lib/api/tag'
import { Suspense } from 'react'
import TagListTable from './internal/tag-list-table'
import TagSearch from './internal/tag-search'

export default async function AdminTagPage() {
  const allTagsPromise = fetchAllTagsPromise()

  return (
    <main className="w-full flex flex-col gap-2">
      <TagSearch />
      <Suspense fallback={<Loading />}>
        <TagListTable allTagsPromise={allTagsPromise} />
      </Suspense>
    </main>
  )
}
