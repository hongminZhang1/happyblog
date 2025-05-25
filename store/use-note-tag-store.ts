import type { NoteTag } from '@prisma/client'
import { create } from 'zustand'

interface INoteTagStore {
  noteTags: NoteTag['tagName'][]
  isFirstRender: boolean
  setNoteTags: (tags: NoteTag['tagName'][]) => void
  appendNoteTag: (tag: NoteTag['tagName']) => void
  updateNoteTag: (oldTag: NoteTag['tagName'], newTag: NoteTag['tagName']) => void
  removeNoteTag: (tag: NoteTag['tagName']) => void
  markRendered: () => void
}

export const useNoteTagStore = create<INoteTagStore>(set => ({
  noteTags: [],
  isFirstRender: true,
  setNoteTags: noteTags => set({ noteTags }),

  appendNoteTag: tag => set(({ noteTags }) => ({
    noteTags: [...noteTags, tag],
  })),

  updateNoteTag: (oldTag, newTag) => set(({ noteTags }) => ({
    noteTags: noteTags.map(t => (t === oldTag ? newTag : t)),
  })),

  removeNoteTag: tag => set(({ noteTags }) => ({
    noteTags: noteTags.filter(t => t !== tag),
  })),

  markRendered: () => set({ isFirstRender: false }),
}))
