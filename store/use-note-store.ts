import type { getNoteList } from '@/actions/notes'
import { create } from 'zustand'

export type WithTagsNote = Awaited<ReturnType<typeof getNoteList>>[number]

interface INoteStore {
  notes: WithTagsNote[]
  isFirstRender: boolean
  setNotes: (notes: WithTagsNote[]) => void
  markRendered: () => void
}

export const useNoteStore = create<INoteStore>(set => ({
  notes: [],
  isFirstRender: true,
  setNotes: notes => set({ notes }),
  markRendered: () => set({ isFirstRender: false }),
}))
