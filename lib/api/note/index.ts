import type { NoteTagItem } from '@/app/api/(cache)/note/getNoteTags/route'
import type { NoteListItem } from '@/store/use-note-store'

export async function fetchNoteListPromise(): Promise<NoteListItem[]> {
  return ((await fetch(`${process.env!.SITE_URL}/api/note/getNoteList`, {
    cache: 'force-cache',
  })).json())
}

export async function fetchNoteTagsPromise(): Promise<NoteTagItem[]> {
  return ((await fetch(`${process.env!.SITE_URL}/api/note/getNoteTags`, {
    cache: 'force-cache',
  })).json())
}
