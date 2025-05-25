import { getNoteList, getTagsOnNote } from '@/actions/notes'
import Loading from '@/components/shared/loading'
import { Suspense } from 'react'
import NoteListTable from './internal/note-list-table'
import { NoteSearch } from './internal/note-search'
import { NoteTagsContainer } from './internal/note-tags-container'

const allNotesPromise = getNoteList()
const initialDataPromise = getTagsOnNote()

export default async function AdminNotePage() {
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
