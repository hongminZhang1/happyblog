import type { getBlogList } from '@/actions/blogs'
import { create } from 'zustand'

export type BlogListItem = Awaited<ReturnType<typeof getBlogList>>[number]

interface IBlogStore {
  blogs: BlogListItem[]
  isFirstRender: boolean
  setBlogs: (blogs: BlogListItem[]) => void
  markRendered: () => void
}

export const useBlogStore = create<IBlogStore>(set => ({
  blogs: [],
  isFirstRender: true,
  setBlogs: blogs => set({ blogs }),
  markRendered: () => set({ isFirstRender: false }),
}))
