import type { getAllBlogs } from '@/actions/blogs'
import { create } from 'zustand'

export type WithTagsBlog = Awaited<ReturnType<typeof getAllBlogs>>[number]

interface IBlogStore {
  blogs: WithTagsBlog[]
  isFirstRender: boolean
  setBlogs: (blogs: WithTagsBlog[]) => void
  markRendered: () => void
}

export const useBlogStore = create<IBlogStore>(set => ({
  blogs: [],
  isFirstRender: true,
  setBlogs: blogs => set({ blogs }),
  markRendered: () => set({ isFirstRender: false }),
}))
