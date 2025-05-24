import { getAllNotes, getTagsOnNote } from '@/actions/notes'
import NoteListTable from './internal/note-list-table'
import { NoteSearch } from './internal/note-search'
import { NoteTagsContainer } from './internal/note-tags-container'

export default async function AdminNotePage() {
  const [allNoteTags, allNotes] = await Promise.all([getTagsOnNote(), getAllNotes()])
  const tags = allNoteTags.map(v => v.tagName)

  return (
    <main className="w-full flex flex-col gap-2">
      <NoteSearch />
      <NoteTagsContainer tags={tags} />
      <NoteListTable initialData={allNotes} />
    </main>
  )
}
