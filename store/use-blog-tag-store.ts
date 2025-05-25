import type { BlogTag } from '@prisma/client'
import { create } from 'zustand'

interface IBlogTagStore {
  blogTags: BlogTag['tagName'][]
  isFirstRender: boolean
  setBlogTags: (tags: BlogTag['tagName'][]) => void
  appendBlogTag: (tag: BlogTag['tagName']) => void
  updateBlogTag: (oldTag: BlogTag['tagName'], newTag: BlogTag['tagName']) => void
  removeBlogTag: (tag: BlogTag['tagName']) => void
  markRendered: () => void
}

export const useBlogTagStore = create<IBlogTagStore>(set => ({
  blogTags: [],
  isFirstRender: true,
  setBlogTags: blogTags => set({ blogTags }),

  appendBlogTag: tag => set(({ blogTags }) => ({
    blogTags: [...blogTags, tag],
  })),

  updateBlogTag: (oldTag, newTag) => set(({ blogTags }) => ({
    blogTags: blogTags.map(t => (t === oldTag ? newTag : t)),
  })),

  removeBlogTag: tag => set(({ blogTags }) => ({
    blogTags: blogTags.filter(t => t !== tag),
  })),

  markRendered: () => set({ isFirstRender: false }),
}))
