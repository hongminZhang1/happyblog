import { prisma } from '@/db'

export type SearchType = 'all' | 'blog' | 'note'

export interface SearchResult {
  id: number
  title: string
  content: string
  slug: string
  type: 'blog' | 'note'
  createdAt: string
  tags: Array<{ tagName: string }>
}

export async function searchContent(query: string, type: SearchType = 'all'): Promise<SearchResult[]> {
  if (!query.trim()) {
    return []
  }

  const searchQuery = `%${query}%`
  const results: SearchResult[] = []

  try {
    // 搜索博客
    if (type === 'all' || type === 'blog') {
      const blogs = await prisma.blog.findMany({
        where: {
          isPublished: true,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
          ],
        },
        include: {
          tags: true,
        },
        take: 10,
        orderBy: {
          createdAt: 'desc',
        },
      })

      results.push(...blogs.map(blog => ({
        id: blog.id,
        title: blog.title,
        content: blog.content,
        slug: blog.slug,
        type: 'blog' as const,
        createdAt: blog.createdAt.toISOString(),
        tags: blog.tags.map(tag => ({ tagName: tag.tagName })),
      })))
    }

    // 搜索笔记
    if (type === 'all' || type === 'note') {
      const notes = await prisma.note.findMany({
        where: {
          isPublished: true,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
          ],
        },
        include: {
          tags: true,
        },
        take: 10,
        orderBy: {
          createdAt: 'desc',
        },
      })

      results.push(...notes.map(note => ({
        id: note.id,
        title: note.title,
        content: note.content,
        slug: note.slug,
        type: 'note' as const,
        createdAt: note.createdAt.toISOString(),
        tags: note.tags.map(tag => ({ tagName: tag.tagName })),
      })))
    }

    // 按时间排序
    results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return results.slice(0, 20)
  }
  catch (error) {
    console.error('搜索失败:', error)
    return []
  }
} 