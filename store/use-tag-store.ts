import type { getAllTags } from '@/actions/tags'
import { create } from 'zustand'

export type Tag = Awaited<ReturnType<typeof getAllTags>>[number]

interface ITagStore {
  tags: Tag[]
  setTags: (tags: Tag[]) => void
}

export const useTagStore = create<ITagStore>(set => ({
  tags: [],
  setTags: tags => set({ tags }),
}))
