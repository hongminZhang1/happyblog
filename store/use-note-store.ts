import type { getNoteList } from '@/actions/notes'
import { create } from 'zustand'

export type NoteListItem = Awaited<ReturnType<typeof getNoteList>>[number]

interface INoteStore {
  notes: NoteListItem[]
  setNotes: (notes: NoteListItem[]) => void
}

export const useNoteStore = create<INoteStore>(set => ({
  notes: [],
  setNotes: notes => set({ notes }),
}))
