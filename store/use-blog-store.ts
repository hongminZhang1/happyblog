import type { getBlogList } from '@/actions/blogs'
import { create } from 'zustand'

export type BlogListItem = Awaited<ReturnType<typeof getBlogList>>[number]

interface IBlogStore {
  blogs: BlogListItem[]
  isFirstRender: boolean
  setBlogs: (blogs: BlogListItem[]) => void
  appendBlog: (blog: BlogListItem) => void
  updateBlog: (blog: BlogListItem) => void
  removeBlog: (blog: BlogListItem['id']) => void
  markRendered: () => void
}

export const useBlogStore = create<IBlogStore>(set => ({
  blogs: [],
  isFirstRender: true,
  setBlogs: blogs => set({ blogs }),

  appendBlog: blog => set(({ blogs }) => ({
    blogs: [...blogs, blog],
  })),

  updateBlog: blog => set(({ blogs }) => ({
    blogs: blogs.map(blogItem => blogItem.id === blog.id ? blog : blogItem),
  })),

  removeBlog: blogId => set(({ blogs }) => ({
    blogs: blogs.filter(blogItem => blogItem.id !== blogId),
  })),

  markRendered: () => set({ isFirstRender: false }),
}))
