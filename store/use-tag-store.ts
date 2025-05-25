import type { getAllTags } from '@/actions/tags'
import { create } from 'zustand'

export type Tag = Awaited<ReturnType<typeof getAllTags>>[number]

interface ITagStore {
  tags: Tag[]
  isFirstRender: boolean
  setTags: (tags: Tag[]) => void
  // appendTag: (tag: Tag) => void
  markRendered: () => void
}

export const useTagStore = create<ITagStore>(set => ({
  tags: [],
  isFirstRender: true,
  setTags: tags => set({ tags }),
  // appendTag: tag => set(({ tags }) => ({
  //   tags: [...tags, tag],
  // })),
  markRendered: () => set({ isFirstRender: false }),
}))
