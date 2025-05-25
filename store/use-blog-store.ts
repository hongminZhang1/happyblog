import type { getBlogList } from '@/actions/blogs'
import { create } from 'zustand'

export type BlogListItem = Awaited<ReturnType<typeof getBlogList>>[number]

interface IBlogStore {
  blogs: BlogListItem[]
  setBlogs: (blogs: BlogListItem[]) => void
}

export const useBlogStore = create<IBlogStore>(set => ({
  blogs: [],
  setBlogs: blogs => set({ blogs }),
}))
