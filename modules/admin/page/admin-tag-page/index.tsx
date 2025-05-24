import { getAllTags } from '@/actions/tags'
import TagListTable from './internal/tag-list-table'
import TagSearch from './internal/tag-search'

export default async function AdminTagPage() {
  const tags = await getAllTags()

  return (
    <main className="w-full flex flex-col gap-2">
      <TagSearch />
      <TagListTable initialData={tags} />
    </main>
  )
}
