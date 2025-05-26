import Loading from '@/components/shared/loading'
import { fetchNoteListPromise, fetchNoteTagsPromise } from '@/lib/api/note'
import { Suspense } from 'react'
import NoteListTable from './internal/note-list-table'
import { NoteSearch } from './internal/note-search'
import { NoteTagsContainer } from './internal/note-tags-container'

export default async function AdminNotePage() {
  const noteTagsPromise = fetchNoteTagsPromise()
  const noteListPromise = fetchNoteListPromise()

  return (
    <main className="w-full flex flex-col gap-2">
      <NoteSearch />
      <Suspense fallback={<Loading />}>
        <NoteTagsContainer noteTagsPromise={noteTagsPromise} />
        <NoteListTable noteListPromise={noteListPromise} />
      </Suspense>
    </main>
  )
}
