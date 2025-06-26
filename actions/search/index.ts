'use server'

import { prisma } from '@/db'

export type SearchType = 'blog' | 'note' | 'all'

export interface SearchResult {
  type: 'blog' | 'note'
  id: number
  title: string
  slug: string
  content: string
  createdAt: Date
  tags: Array<{ tagName: string }>
}

export async function searchContent(query: string, searchType: SearchType = 'all'): Promise<SearchResult[]> {
  if (!query.trim()) {
    return []
  }

  const searchQuery = {
    OR: [
      {
        title: {
          contains: query,
          mode: 'insensitive' as const,
        },
      },
      {
        content: {
          contains: query,
          mode: 'insensitive' as const,
        },
      },
    ],
    isPublished: true,
  }

  const results: SearchResult[] = []

  // 搜索博客
  if (searchType === 'blog' || searchType === 'all') {
    const blogs = await prisma.blog.findMany({
      where: searchQuery,
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        createdAt: true,
        tags: {
          select: {
            tagName: true,
          },
        },
      },
      take: 20, // 限制结果数量
    })

    results.push(
      ...blogs.map(blog => ({
        ...blog,
        type: 'blog' as const,
      })),
    )
  }

  // 搜索笔记
  if (searchType === 'note' || searchType === 'all') {
    const notes = await prisma.note.findMany({
      where: searchQuery,
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        createdAt: true,
        tags: {
          select: {
            tagName: true,
          },
        },
      },
      take: 20, // 限制结果数量
    })

    results.push(
      ...notes.map(note => ({
        ...note,
        type: 'note' as const,
      })),
    )
  }

  // 按创建时间排序
  return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
} 