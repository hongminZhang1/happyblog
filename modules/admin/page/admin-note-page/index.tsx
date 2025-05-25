import { getNoteList } from '@/actions/notes'
import { getNoteTags } from '@/actions/tags'
import Loading from '@/components/shared/loading'
import { Suspense } from 'react'
import NoteListTable from './internal/note-list-table'
import { NoteSearch } from './internal/note-search'
import { NoteTagsContainer } from './internal/note-tags-container'

export default async function AdminNotePage() {
  const allNotesPromise = getNoteList()
  const initialDataPromise = getNoteTags()

  return (
    <main className="w-full flex flex-col gap-2">
      <NoteSearch />
      <Suspense fallback={<Loading />}>
        <NoteTagsContainer initialDataPromise={initialDataPromise} />
        <NoteListTable initialDataPromise={allNotesPromise} />
      </Suspense>
    </main>
  )
}
