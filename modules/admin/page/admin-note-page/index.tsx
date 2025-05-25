import { getAllNotes, getTagsOnNote } from '@/actions/notes'
import Loading from '@/components/shared/loading'
import { Suspense } from 'react'
import NoteListTable from './internal/note-list-table'
import { NoteSearch } from './internal/note-search'
import { NoteTagsContainer } from './internal/note-tags-container'

export default async function AdminNotePage() {
  const allNotesPromise = getAllNotes()
  const initialDataPromise = getTagsOnNote()

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
