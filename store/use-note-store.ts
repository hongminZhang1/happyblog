import type { getNoteList } from '@/actions/notes'
import { create } from 'zustand'

export type NoteListItem = Awaited<ReturnType<typeof getNoteList>>[number]

interface INoteStore {
  notes: NoteListItem[]
  isFirstRender: boolean
  setNotes: (notes: NoteListItem[]) => void
  appendNote: (blog: NoteListItem) => void
  updateNote: (note: NoteListItem) => void
  markRendered: () => void
}

export const useNoteStore = create<INoteStore>(set => ({
  notes: [],
  isFirstRender: true,
  setNotes: notes => set({ notes }),

  appendNote: note => set(({ notes }) => ({
    notes: [...notes, note],
  })),

  updateNote: note => set(({ notes }) => ({
    notes: notes.map(noteItem => noteItem.id === note.id ? note : noteItem),
  })),

  markRendered: () => set({ isFirstRender: false }),
}))
